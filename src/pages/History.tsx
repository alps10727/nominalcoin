
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Zap, UserPlus, ShoppingCart, ArrowDownUp, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: 'mining' | 'referral' | 'purchase';
}

const History = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<string | null>(null);

  // Sample transaction data
  const [transactions] = useState<Transaction[]>([
    { id: 1, date: '2023-08-15T12:30:00', amount: 0.5, type: 'mining' },
    { id: 2, date: '2023-08-15T13:00:00', amount: 0.5, type: 'mining' },
    { id: 3, date: '2023-08-14T10:15:00', amount: 5.0, type: 'referral' },
    { id: 4, date: '2023-08-10T09:45:00', amount: -10.0, type: 'purchase' },
    { id: 5, date: '2023-08-05T14:20:00', amount: 0.5, type: 'mining' },
    { id: 6, date: '2023-08-01T16:30:00', amount: 0.5, type: 'mining' },
  ]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mining':
        return <Zap className="h-4 w-4 text-green-400" />;
      case 'referral':
        return <UserPlus className="h-4 w-4 text-indigo-400" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-red-400" />;
      default:
        return <HistoryIcon className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getTransactionName = (type: string) => {
    switch (type) {
      case 'mining':
        return t('history.mining');
      case 'referral':
        return t('history.referral');
      case 'purchase':
        return t('history.purchase');
      default:
        return type;
    }
  };

  const handleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredTransactions = transactions
    .filter(tx => !filter || tx.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{t('history.title')}</h1>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200">
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  {filter ? getTransactionName(filter) : 'All'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuItem onClick={() => setFilter(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('mining')}>
                  {t('history.mining')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('referral')}>
                  {t('history.referral')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('purchase')}>
                  {t('history.purchase')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-gray-800 text-gray-100 dark:bg-gray-850">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-lg text-gray-200">{t('history.title')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-750">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('history.type')}</th>
                    <th 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        {t('history.date')}
                        {sortBy === 'date' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="h-4 w-4 ml-1" /> : 
                            <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                        {t('history.amount')}
                        {sortBy === 'amount' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="h-4 w-4 ml-1" /> : 
                            <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-1 rounded-full bg-gray-700 mr-2">
                              {getTransactionIcon(tx.type)}
                            </div>
                            <span>{getTransactionName(tx.type)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(tx.date)}
                        </td>
                        <td className={`py-4 px-4 whitespace-nowrap text-right font-medium ${getTransactionColor(tx.amount)}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} FC
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-400">
                        {t('history.empty')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default History;
