
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { useAdminActions } from "@/hooks/admin/useAdminActions";

interface ReferralStats {
  userId: string;
  emailAddress: string;
  referrals: string[];
  referralCount: number;
  referralCode: string;
}

const AdminReferrals = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats[]>([]);
  const { getReferralStats } = useAdminActions();
  
  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getReferralStats();
      setStats(data);
    } catch (error) {
      console.error("Referans istatistikleri yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadStats();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Referans İstatistikleri</h3>
        <Button 
          variant="outline" 
          onClick={loadStats} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>En Çok Davet Eden Kullanıcılar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              {loading ? "Yükleniyor..." : `Toplam ${stats.length} kullanıcı`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>E-posta</TableHead>
                <TableHead>Referans Kodu</TableHead>
                <TableHead className="text-right">Davet Edilen Kişi Sayısı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Veri bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                // Davet sayısına göre sıralama
                [...stats]
                  .sort((a, b) => (b.referralCount || 0) - (a.referralCount || 0))
                  .map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>{user.emailAddress || "N/A"}</TableCell>
                      <TableCell>{user.referralCode || "N/A"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {user.referralCount || 0}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferrals;
