
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Admin credentials for direct access
const ADMIN_CREDENTIALS = {
  email: "ncowner0001@gmail.com",
  password: "1069GYSF"
};

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
    
    // If admin credentials match, set admin session and redirect
    if (adminEmail?.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && 
        adminKey === ADMIN_CREDENTIALS.password) {
      console.log("Direct admin login detected");
      localStorage.setItem('isAdminSession', 'true');
      navigate("/admin", { replace: true });
    }
  }, [navigate, location]);

  return null; // This component doesn't render anything
};

export default AdminLoginHandler;
