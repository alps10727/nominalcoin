
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import UserBalanceModal from "./UserBalanceModal";

const AdminUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, loading, searchUsers, refreshUsers } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers(searchQuery);
  };

  const handleEditBalance = (user: any) => {
    setSelectedUser(user);
    setShowBalanceModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="E-posta veya kullanıcı adı ile ara"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Ara</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => refreshUsers()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Toplam Kullanıcı: {users.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı ID</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Bakiye</TableHead>
              <TableHead>Mining Hızı</TableHead>
              <TableHead>Son Aktivite</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {loading ? "Yükleniyor..." : "Kullanıcı bulunamadı"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-mono text-xs">{user.userId.slice(0, 8)}...</TableCell>
                  <TableCell>{user.emailAddress || "N/A"}</TableCell>
                  <TableCell>{user.balance?.toFixed(4) || "0.0000"}</TableCell>
                  <TableCell>{user.miningRate || "0.003"}</TableCell>
                  <TableCell>
                    {user.lastSaved ? new Date(user.lastSaved).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleEditBalance(user)}
                    >
                      Bakiye Düzenle
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserBalanceModal
          user={selectedUser}
          open={showBalanceModal}
          onOpenChange={setShowBalanceModal}
        />
      )}
    </div>
  );
};

export default AdminUserManagement;
