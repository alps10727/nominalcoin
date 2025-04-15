
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { registerUser } from "@/services/authService";
import { UserRegistrationData } from "@/services/auth/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NameInput } from "./inputs/NameInput";
import { EmailInput } from "./inputs/EmailInput";
import { PasswordInputGroup } from "./form-sections/PasswordInputGroup";
import { FormErrorDisplay } from "./form-sections/FormErrorDisplay";
import { SignUpButton } from "./buttons/SignUpButton";
import { TermsAgreement } from "./terms/TermsAgreement";

// SignUp Schema
const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "Ad alanı en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  password: z.string().min(6, {
    message: "Şifre en az 6 karakter olmalıdır.",
  }),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "Kullanım koşullarını kabul etmelisiniz." }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      agreedToTerms: false,
    },
  });
  
  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setLoading(true);
      setGeneralError("");
      
      const userData: UserRegistrationData = {
        name: values.name,
        referralCode: values.referralCode || undefined,
      };
      
      await registerUser(values.email, values.password, userData);
      toast.success("Hesabınız başarıyla oluşturuldu!");
      
      // Navigate to dashboard after successful registration
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle Firebase error messages
      if (error.code === "auth/email-already-in-use") {
        setGeneralError("Bu e-posta adresi zaten kullanımda.");
      } else if (error.code === "auth/invalid-email") {
        setGeneralError("Geçersiz e-posta adresi.");
      } else if (error.code === "auth/weak-password") {
        setGeneralError("Şifre çok zayıf.");
      } else {
        setGeneralError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameInput control={form.control} />
        <EmailInput control={form.control} />
        <PasswordInputGroup control={form.control} />
        
        {/* Referral Code Input */}
        <div className="space-y-1">
          <label htmlFor="referralCode" className="text-sm font-medium">
            Referans Kodu (İsteğe Bağlı)
          </label>
          <input
            id="referralCode"
            type="text"
            className="w-full p-2 border rounded-md bg-background"
            placeholder="Referans kodu girin"
            {...form.register("referralCode")}
          />
        </div>
        
        <TermsAgreement control={form.control} />
        <FormErrorDisplay error={generalError} />
        <SignUpButton loading={loading} />
      </form>
    </Form>
  );
}
