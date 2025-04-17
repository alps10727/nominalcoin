
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Users, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePoolSystem } from "@/hooks/usePoolSystem";
import { MiningPool } from "@/types/pools";
import TeamHeader from "@/components/team/TeamHeader";

export default function TeamPools() {
  const { userData } = useAuth();
  const { 
    loading, 
    currentPool, 
    availablePools, 
    loadAvailablePools, 
    joinPool, 
    leavePool 
  } = usePoolSystem();
  
  const [viewingPools, setViewingPools] = useState(false);
  
  // Load pools when viewing the list
  const handleViewPools = async () => {
    setViewingPools(true);
    await loadAvailablePools();
  };
  
  return (
    <div className="container py-8">
      <TeamHeader />
      
      {/* Current Pool Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-200">Havuz Durumu</h2>
        
        {loading ? (
          <Card className="bg-gray-900/50 border-purple-800/30">
            <CardContent className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            </CardContent>
          </Card>
        ) : currentPool ? (
          <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-800/30 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-100">{currentPool.name}</CardTitle>
                <Badge variant="outline" className="bg-indigo-500/20 text-indigo-100 border-indigo-400/30">
                  Seviye {currentPool.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Üye Sayısı:</span>
                  <span className="text-gray-200">{currentPool.memberCount} / {currentPool.capacity || 100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Katılma Tarihi:</span>
                  <span className="text-gray-200">{userData?.poolMembership?.joinDate?.split('T')[0] || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rütbeniz:</span>
                  <span className="text-indigo-300 font-medium">{userData?.miningStats?.rank || 'Çaylak'}</span>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="destructive" 
                    className="w-full mt-2 bg-red-900/60 hover:bg-red-800"
                    onClick={() => leavePool()}
                  >
                    Havuzdan Ayrıl
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <Users className="h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-gray-300 font-medium">Henüz bir havuza katılmadınız</h3>
                <p className="text-gray-500 text-sm max-w-md">
                  Madencilik havuzları, bonus kazım hızı ve özel görevler sunar. Hemen bir havuza katılın!
                </p>
                <Button 
                  variant="outline" 
                  className="mt-3 border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                  onClick={handleViewPools}
                >
                  Havuzları Görüntüle
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Available Pools Section */}
      {viewingPools && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-200">Mevcut Havuzlar</h2>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30">
              <Plus className="h-4 w-4 mr-1" />
              Yeni Havuz Oluştur
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availablePools.map((pool) => (
                <PoolCard 
                  key={pool.poolId} 
                  pool={pool} 
                  onJoin={() => joinPool(pool.poolId)} 
                  disabled={loading}
                />
              ))}
              
              {availablePools.length === 0 && (
                <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400">Henüz oluşturulmuş havuz bulunmuyor.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface PoolCardProps {
  pool: MiningPool;
  onJoin: () => void;
  disabled?: boolean;
}

function PoolCard({ pool, onJoin, disabled }: PoolCardProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border-indigo-900/30 hover:border-indigo-700/40 transition-all">
      <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 px-4 py-3 border-b border-indigo-800/20">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-indigo-100">{pool.name}</h3>
          <Badge variant="outline" className="bg-indigo-500/10 border-indigo-400/30">
            Seviye {pool.level}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Üye Sayısı:</span>
            <span className="text-gray-200">{pool.memberCount} / {pool.capacity || 100}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Min. Madencilik:</span>
            <span className="text-gray-200">{pool.minRequirements.miningDays} gün</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Min. Bakiye:</span>
            <span className="text-gray-200">{pool.minRequirements.minBalance} NC</span>
          </div>
          
          <Button 
            onClick={onJoin}
            disabled={disabled}
            className="w-full mt-3 bg-indigo-600/60 hover:bg-indigo-600/80 text-white"
          >
            Katıl
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
