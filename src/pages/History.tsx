
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const History = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-100 to-purple-200 bg-clip-text text-transparent">{t('history.title')}</h1>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-gray-100 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-100">
              {t('history.transactions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-indigo-300 text-center py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-800/50 flex items-center justify-center mb-4 border border-indigo-500/30">
                <svg 
                  className="h-8 w-8 text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                </svg>
              </div>
              {t('history.no_transactions')}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
