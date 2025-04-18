
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
    const { table } = await req.json()
    
    if (!table) {
      throw new Error('Table name is required')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    console.log(`Enabling realtime for table: ${table}`);

    try {
      // First try to alter the table to set replica identity to full if not already set
      const { error: alterError } = await supabaseAdmin
        .rpc('alter_table_set_replica_identity', { table_name: table })
        .single()
      
      if (alterError) {
        console.warn('Error setting replica identity:', alterError)
        // Continue even if this fails
      }
      
      // Add the table to supabase_realtime publication
      const { error: publicationError } = await supabaseAdmin
        .rpc('add_table_to_publication', { table_name: table })
        .single()
      
      if (publicationError) {
        console.warn('Error adding table to publication:', publicationError)
        // Continue even if this fails
      }
      
      console.log(`Realtime enabled for table: ${table}`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Realtime enabled for table: ${table}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Error enabling realtime:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in enable_realtime function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
