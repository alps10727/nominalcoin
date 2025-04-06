
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, AlertCircle, LogIn } from "lucide-react";

interface SignInFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SignInForm = ({ onSubmit, loading, error }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, rememberMe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Email adresinizi girin"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Şifre</Label>
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Şifremi unuttum?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Şifrenizi girin"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => {
            setRememberMe(checked as boolean);
          }}
          disabled={loading}
        />
        <label
          htmlFor="remember"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Beni hatırla
        </label>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            Giriş yapılıyor...
          </div>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            Giriş Yap
          </>
        )}
      </Button>
    </form>
  );
};

export default SignInForm;
