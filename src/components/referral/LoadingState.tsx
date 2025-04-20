
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container max-w-md px-4 py-8 mx-auto text-center">
      <p className="text-gray-400">{t("referral.loading")}</p>
    </div>
  );
};

export default LoadingState;
