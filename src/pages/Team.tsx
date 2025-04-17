
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Dices, MessageSquare } from "lucide-react";
import TeamHeader from "@/components/team/TeamHeader";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import { usePoolSystem } from "@/hooks/usePoolSystem";
import { useAuth } from "@/contexts/AuthContext";

// Example team member data
const teamMembers = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    role: "Lider",
    avatar: "https://i.pravatar.cc/150?img=1",
    balance: 1240,
    miningDays: 120
  },
  {
    id: 2,
    name: "Ayşe Demir",
    role: "Madenci",
    avatar: "https://i.pravatar.cc/150?img=2",
    balance: 860,
    miningDays: 78
  },
  {
    id: 3,
    name: "Murat Kaya",
    role: "Madenci",
    avatar: "https://i.pravatar.cc/150?img=3",
    balance: 540,
    miningDays: 45
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    role: "Çaylak",
    avatar: "https://i.pravatar.cc/150?img=4",
    balance: 120,
    miningDays: 15
  },
];

export default function Team() {
  const { userData } = useAuth();
  const { currentPool, loading } = usePoolSystem();
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <TeamHeader />
      
      <Tabs defaultValue="team" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 bg-gray-900/50 border border-gray-800/50">
          <TabsTrigger value="team" className="data-[state=active]:bg-purple-900/30">
            <Users className="h-4 w-4 mr-2" />
            Takım
          </TabsTrigger>
          <TabsTrigger value="pool" className="data-[state=active]:bg-indigo-900/30">
            <Dices className="h-4 w-4 mr-2" />
            Havuz
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-cyan-900/30">
            <MessageSquare className="h-4 w-4 mr-2" />
            Sohbet
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="team" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
          
          <Card className="mt-8 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg text-purple-200 mb-2">Takımı Büyütelim!</h3>
                  <p className="text-gray-400 text-sm">Arkadaşlarınızı davet edin ve birlikte madencilik yapmanın avantajlarından yararlanın.</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Davet Et
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pool" className="mt-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg p-6 border border-indigo-700/30">
              <h2 className="text-xl font-semibold mb-4 text-indigo-200">Madencilik Havuzunuz</h2>
              
              {currentPool ? (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-medium text-white">{currentPool.name}</h3>
                      <p className="text-indigo-300">Seviye {currentPool.level} Havuz</p>
                    </div>
                    <div className="bg-indigo-800/30 px-4 py-2 rounded-md border border-indigo-700/30">
                      <div className="text-sm font-medium text-indigo-100">
                        {currentPool.memberCount}/{currentPool.capacity || 100} Üye
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-900/20 rounded-md p-3 border border-indigo-800/30">
                      <div className="text-sm text-gray-400">Rütbeniz</div>
                      <div className="text-lg font-medium text-indigo-200">
                        {userData?.miningStats?.rank || "Çaylak"}
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/20 rounded-md p-3 border border-indigo-800/30">
                      <div className="text-sm text-gray-400">Kazanç Bonusu</div>
                      <div className="text-lg font-medium text-green-300">
                        {userData?.miningStats?.rank === "Madenci" ? "+%10" : 
                         userData?.miningStats?.rank === "Lider" ? "+%25" : "+%0"}
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/20 rounded-md p-3 border border-indigo-800/30">
                      <div className="text-sm text-gray-400">Madencilik Günü</div>
                      <div className="text-lg font-medium text-indigo-200">
                        {userData?.miningStats?.totalDays || 0} gün
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/20">
                      Detaylar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                  <h3 className="text-gray-300 font-medium mb-2">Henüz Bir Havuza Katılmadınız</h3>
                  <p className="text-gray-400 text-sm mb-5 max-w-md mx-auto">
                    Madencilik havuzları, bonus kazım hızı ve özel görevler sunar. Hemen bir havuza katılın!
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    onClick={() => window.location.href = "/team/pools"}
                  >
                    Havuzlara Göz At
                  </Button>
                </div>
              )}
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800/50">
              <h3 className="font-medium text-lg text-gray-200 mb-3">Rütbe Sistemi</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-2 text-gray-400 font-normal">Rütbe</th>
                      <th className="pb-2 text-gray-400 font-normal">Kazım Günü</th>
                      <th className="pb-2 text-gray-400 font-normal">Kazanç Bonusu</th>
                      <th className="pb-2 text-gray-400 font-normal">Yetkiler</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800/50">
                      <td className="py-3 text-gray-300">Çaylak</td>
                      <td className="py-3 text-gray-300">0-30</td>
                      <td className="py-3 text-gray-300">+%0</td>
                      <td className="py-3 text-gray-300">Sadece katılma</td>
                    </tr>
                    <tr className="border-b border-gray-800/50">
                      <td className="py-3 text-indigo-300">Madenci</td>
                      <td className="py-3 text-gray-300">31-100</td>
                      <td className="py-3 text-green-300">+%10</td>
                      <td className="py-3 text-gray-300">Görev oluşturabilir</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-purple-300">Lider</td>
                      <td className="py-3 text-gray-300">101+</td>
                      <td className="py-3 text-green-300">+%25</td>
                      <td className="py-3 text-gray-300">Üye davet/çıkarma</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <Card className="bg-gray-900/70 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                <h3 className="text-gray-400 font-medium mb-2">Sohbet Yakında</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Takım sohbeti yakında aktif olacak. Güncellemeleri takip edin!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
