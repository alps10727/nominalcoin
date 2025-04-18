
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    
    if (!email) {
      throw new Error('Email is required')
    }
    
    console.log(`Attempting to confirm email: ${email}`);

    // Create Supabase admin client with service role for privileged actions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Try to find the user by email
    const { data: userData, error: findError } = await supabaseAdmin.auth.admin
      .listUsers()
      .then(response => {
        const users = response.data.users || [];
        const user = users.find(u => u.email === email);
        return {
          data: user ? { user } : null,
          error: user ? null : new Error('User not found')
        };
      });
      
    if (findError || !userData) {
      console.error('Error finding user:', findError || 'User not found');
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // If user found but not confirmed, update email confirmation status
    if (!userData.user.email_confirmed_at) {
      // Generate link for the user
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin
        .generateLink({
          type: 'signup',
          email,
        });
        
      if (linkError) {
        console.error('Error generating link:', linkError);
        throw linkError;
      }
      
      // Confirm user's email directly
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userData.user.id, 
        { email_confirm: true }
      );
      
      if (updateError) {
        console.error('Error confirming email:', updateError);
        throw updateError;
      }
      
      console.log(`Email confirmed for user: ${email}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Email confirmed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log(`Email already confirmed for user: ${email}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Email already confirmed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in confirm_email function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
