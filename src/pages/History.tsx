
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const History = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('history.title')}</h1>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-navy-900 text-gray-100 dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="text-xl">
              {t('history.transactions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400 text-center py-8">
              {t('history.no_transactions')}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
