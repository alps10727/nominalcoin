
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Award, Scale, Database } from "lucide-react";
import { MiningPool, MemberRank } from "@/types/pools";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";

interface PoolDetailsCardProps {
  pool: MiningPool;
  onLeave?: () => Promise<boolean>;
  showLeaveButton?: boolean;
}

export default function PoolDetailsCard({ pool, onLeave, showLeaveButton = true }: PoolDetailsCardProps) {
  const createdAt = pool.createdAt?.toDate();
  const timeAgo = createdAt 
    ? formatDistance(createdAt, new Date(), { addSuffix: true, locale: tr })
    : "bilinmiyor";

  return (
    <Card className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border-indigo-900/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-indigo-100">{pool.name}</CardTitle>
          <Badge variant="outline" className="bg-indigo-500/20 text-indigo-100 border-indigo-400/30">
            Seviye {pool.level}
          </Badge>
        </div>
        <p className="text-sm text-gray-400">{timeAgo} oluşturuldu</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {pool.description && (
          <p className="text-gray-300 text-sm">{pool.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-300">
              {pool.memberCount} / {pool.capacity || 100} Üye
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Database className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-300">
              {pool.isPublic ? "Herkese Açık" : "Özel"}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-300">
              Min. {pool.minRequirements.miningDays} gün
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Scale className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-300">
              Min. {pool.minRequirements.minBalance} NC
            </span>
          </div>
        </div>

        {pool.minRank && pool.minRank !== MemberRank.ROOKIE && (
          <div className="flex items-center space-x-2 text-sm">
            <Award className="h-4 w-4 text-purple-400" />
            <span className="text-purple-200">
              Min. Rütbe: {pool.minRank}
            </span>
          </div>
        )}

        {showLeaveButton && onLeave && (
          <Button 
            variant="destructive" 
            onClick={onLeave} 
            className="w-full mt-3 bg-red-900/60 hover:bg-red-800 text-white"
          >
            Havuzdan Ayrıl
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
