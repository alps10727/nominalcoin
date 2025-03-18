
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowUpRight, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DashboardActions = () => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100 dark:bg-gray-850">
        <CardHeader className="p-4">
          <CardTitle className="text-md flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                <Shield className="h-5 w-5 text-indigo-400" />
              </div>
              <span>{t('security.title')}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100 dark:bg-gray-850">
        <CardHeader className="p-4">
          <CardTitle className="text-md flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                <ArrowUpRight className="h-5 w-5 text-indigo-400" />
              </div>
              <span>{t('transfer.title')}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DashboardActions;
