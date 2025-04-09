
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminMessaging from "@/components/admin/AdminMessaging";
import AdminReferrals from "@/components/admin/AdminReferrals";

const AdminIndex = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Paneli</h1>
          <div className="bg-yellow-100 px-4 py-2 rounded-md">
            <p className="text-yellow-800 font-medium">
              Admin olarak giriş yaptınız: {userData?.emailAddress}
            </p>
          </div>
        </div>
        
        <Card className="border-none shadow-md">
          <CardHeader className="bg-slate-50 dark:bg-slate-900">
            <CardTitle>Yönetim Araçları</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b px-4 pt-2">
                <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
                <TabsTrigger value="messaging">Mesajlaşma</TabsTrigger>
                <TabsTrigger value="referrals">Referans İstatistikleri</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="p-4">
                <AdminUserManagement />
              </TabsContent>
              
              <TabsContent value="messaging" className="p-4">
                <AdminMessaging />
              </TabsContent>
              
              <TabsContent value="referrals" className="p-4">
                <AdminReferrals />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminIndex;
