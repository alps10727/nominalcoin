
import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "Ad alanı en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  password: z.string()
    .min(6, { message: "Şifre en az 6 karakter olmalıdır." })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
      message: "Şifre en az bir harf ve bir rakam içermelidir."
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

export type SignUpFormValues = z.infer<typeof signUpSchema>;
