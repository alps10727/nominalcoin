
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-teal-400">404</h1>
        <p className="text-xl text-gray-300 mb-6">Sayfa bulunamadı</p>
        <a href="/" className="text-teal-500 hover:text-teal-400 bg-navy-800 px-6 py-2 rounded-lg transition-colors">
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
};

export default NotFound;
