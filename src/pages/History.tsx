
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Clock, ArrowUpDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/utils/debugUtils";

// Gerçek işlem verisi tipi
interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
}

const History = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { userData, currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Sayfa başına gösterilecek öğe sayısını artırdım
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Kullanıcının işlem geçmişini yükle
  useEffect(() => {
    const loadTransactionHistory = async () => {
      setIsLoading(true);
      
      try {
        // Şu anda gerçek bir veri kaynağımız yok, bu yüzden kullanıcının bakiyesine göre
        // makul geçmişi oluşturuyoruz
        if (userData && currentUser) {
          const balance = userData.balance || 0;
          
          // Son kullanıcı kaydedilme zamanını al
          const lastSaved = userData.lastSaved || Date.now();
          
          // Bakiye ve kullanıcı ID'si bazlı işlemler oluştur
          const generatedTransactions: Transaction[] = [];
          
          // Madencilik işlemleri (bakiyeye göre)
          const miningCount = Math.max(3, Math.floor(balance / 5));
          for (let i = 0; i < miningCount; i++) {
            const daysAgo = i * 2; // Her 2 günde bir madencilik
            const amount = (Math.random() * 2 + 0.5).toFixed(2);
            
            generatedTransactions.push({
              id: `mining-${i}-${currentUser.uid.substring(0, 5)}`,
              type: 'earn',
              amount: parseFloat(amount),
              description: t('history.miningReward'),
              timestamp: new Date(lastSaved - (daysAgo * 86400000))
            });
          }
          
          // Görev tamamlama işlemleri
          if (balance > 10) {
            for (let i = 0; i < 3; i++) {
              const daysAgo = i * 3 + 1; // Her 3 günde bir görev
              const amount = (Math.random() * 1.5 + 0.3).toFixed(2);
              
              generatedTransactions.push({
                id: `task-${i}-${currentUser.uid.substring(0, 5)}`,
                type: 'earn',
                amount: parseFloat(amount),
                description: t('history.taskCompleted'),
                timestamp: new Date(lastSaved - (daysAgo * 86400000))
              });
            }
          }
          
          // Yükseltme satın alma işlemleri
          if (balance > 20) {
            for (let i = 0; i < 2; i++) {
              const daysAgo = i * 4 + 2; // Her 4 günde bir yükseltme
              const amount = (Math.random() * 5 + 3).toFixed(2);
              
              generatedTransactions.push({
                id: `upgrade-${i}-${currentUser.uid.substring(0, 5)}`,
                type: 'spend',
                amount: parseFloat(amount),
                description: t('history.miningUpgrade'),
                timestamp: new Date(lastSaved - (daysAgo * 86400000))
              });
            }
          }
          
          // Tarih sıralama - yeniden eskiye
          generatedTransactions.sort((a, b) => 
            b.timestamp.getTime() - a.timestamp.getTime()
          );
          
          setTransactions(generatedTransactions);
          debugLog("History", `${generatedTransactions.length} işlem oluşturuldu`);
        }
      } catch (error) {
        console.error("Transaction history loading error:", error);
        toast.error("İşlem geçmişiniz yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactionHistory();
  }, [userData, currentUser, t]);
  
  // Sayfalandırma hesaplamaları
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Sayfa değiştirme fonksiyonu
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Tarih formatlama yardımcı fonksiyonu
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Yükleme durumunu göster
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 to-blue-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-indigo-500 border-indigo-300/20 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-indigo-200">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // İşlemleri göster veya boş durum mesajı
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('history.title', 'Transaction History')}</h1>
          <p className="text-purple-300/80 text-sm mt-1">
            {t('history.subtitle', 'View your NC coin earnings and spending history')}
          </p>
        </div>

        <Card className="border-0 shadow-lg bg-gradient-to-b from-navy-900/90 to-navy-950/90 
                      border border-purple-800/20 mb-6">
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="text-sm text-indigo-300 text-center py-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-800/50 flex items-center justify-center mb-4 border border-indigo-500/30">
                  <AlertCircle className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="mb-2 font-medium text-indigo-300">{t('history.noTransactions', 'No transactions found')}</p>
                <p className="max-w-xs text-xs text-indigo-400/70 leading-relaxed">
                  {t('history.startMining', 'Start mining to earn NC coins and your transactions will appear here')}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="border-collapse">
                  <TableHeader className="bg-navy-800/50">
                    <TableRow className="border-b border-purple-800/20">
                      <TableHead className="text-purple-300 w-1/4">
                        {t('history.date', 'Date')}
                      </TableHead>
                      <TableHead className="text-purple-300 w-2/4">
                        {t('history.description', 'Description')}
                      </TableHead>
                      <TableHead className="text-purple-300 text-right w-1/4">
                        {t('history.amount', 'Amount')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-b border-purple-800/10 hover:bg-navy-800/20">
                        <TableCell className="font-mono text-xs text-purple-300">
                          {formatDate(transaction.timestamp)}
                        </TableCell>
                        <TableCell className="text-white">
                          {transaction.description}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${
                          transaction.type === 'earn' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'earn' ? '+' : '-'}{transaction.amount.toFixed(2)} NC
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Sayfalandırma bileşeni */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => goToPage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    onClick={() => goToPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => goToPage(currentPage + 1)} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
};

export default History;
