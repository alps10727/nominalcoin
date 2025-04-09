
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isAdminCredentials } from "@/config/adminConfig";
import { toast } from "sonner";

/**
 * Special component that handles direct admin logins via URL params
 * This allows admin access even when Firebase is down
 */
const AdminLoginHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if URL contains admin credentials
    const params = new URLSearchParams(location.search);
    const adminEmail = params.get('admin_email');
    const adminKey = params.get('admin_key');
    
    if (adminEmail && adminKey) {
      console.log("Checking admin credentials from URL params");
      // If admin credentials match, set admin session and redirect
      if (isAdminCredentials(adminEmail, adminKey)) {
        console.log("Direct admin login successful via URL params");
        localStorage.setItem('isAdminSession', 'true');
        toast.success("Admin girişi başarılı!");
        
        // Kısa bir gecikme ekleyerek yönlendirme sorununu çözüyoruz
        setTimeout(() => {
          console.log("Admin paneline yönlendiriliyor...");
          navigate("/admin", { replace: true });
        }, 100);
      } else {
        console.log("Invalid admin credentials in URL params");
        toast.error("Geçersiz admin kimlik bilgileri");
      }
    }
  }, [navigate, location]);

  return null; // This component doesn't render anything
};

export default AdminLoginHandler;
