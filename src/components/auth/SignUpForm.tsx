
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SignUpForm = ({ onSubmit, loading, error }: SignUpFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Şifreler eşleşmiyor");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setPasswordError(null);
    await onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-200">
          Ad Soyad
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="Ad Soyad"
            className="pl-9 bg-navy-900/50 border-purple-900/30 placeholder:text-gray-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-200">
          E-posta
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="ornek@mail.com"
            className="pl-9 bg-navy-900/50 border-purple-900/30 placeholder:text-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-200">
          Şifre
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-9 bg-navy-900/50 border-purple-900/30 placeholder:text-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
          Şifre Tekrarı
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-9 bg-navy-900/50 border-purple-900/30 placeholder:text-gray-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {passwordError && (
          <p className="text-sm text-red-400 mt-1">{passwordError}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
      </Button>

      <div className="text-center text-sm text-gray-400">
        Zaten hesabınız var mı?{" "}
        <Link to="/sign-in" className="text-purple-400 hover:text-purple-300">
          Giriş Yap
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
