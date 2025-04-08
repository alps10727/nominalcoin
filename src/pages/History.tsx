
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Clock, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Geçici işlem verisi oluşturalım (gerçek uygulamada Firebase'den gelmeli)
interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
}

const dummyTransactions: Transaction[] = [
  { id: '1', type: 'earn', amount: 10.5, description: 'Mining reward', timestamp: new Date(2023, 3, 15) },
  { id: '2', type: 'earn', amount: 5.2, description: 'Daily task completed', timestamp: new Date(2023, 3, 16) },
  { id: '3', type: 'spend', amount: 8.0, description: 'Mining upgrade', timestamp: new Date(2023, 3, 17) },
  { id: '4', type: 'earn', amount: 12.3, description: 'Mining reward', timestamp: new Date(2023, 3, 18) },
  { id: '5', type: 'earn', amount: 3.7, description: 'Achievement earned', timestamp: new Date(2023, 3, 19) },
  { id: '6', type: 'spend', amount: 15.0, description: 'Premium feature unlock', timestamp: new Date(2023, 3, 20) },
  { id: '7', type: 'earn', amount: 7.8, description: 'Mining reward', timestamp: new Date(2023, 3, 21) },
];

const History = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Sayfalandırma hesaplamaları
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = dummyTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dummyTransactions.length / itemsPerPage);

  // Sayfa değiştirme fonksiyonu
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // İşlemleri göster veya boş durum mesajı
  const renderTransactions = () => {
    if (dummyTransactions.length === 0) {
      return (
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
      );
    }

    return (
      <>
        <Table className="border-collapse">
          <TableHeader className="bg-indigo-900/30">
            <TableRow>
              <TableHead className="text-indigo-300">Tarih</TableHead>
              <TableHead className="text-indigo-300">İşlem</TableHead>
              <TableHead className="text-indigo-300 text-right">Miktar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map(transaction => (
              <TableRow key={transaction.id} className="border-b border-indigo-800/30">
                <TableCell className="text-indigo-200">
                  {transaction.timestamp.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-indigo-200">
                  {transaction.description}
                </TableCell>
                <TableCell className={`text-right font-medium ${transaction.type === 'earn' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount.toFixed(2)} FC
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-100 to-purple-200 bg-clip-text text-transparent">{t('history.title')}</h1>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-gray-100 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-300" />
              {t('history.transactions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderTransactions()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
