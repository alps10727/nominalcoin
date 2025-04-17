
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Star, ShieldCheck } from "lucide-react";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import TeamHeader from "@/components/team/TeamHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const Team = () => {
  const { t } = useLanguage();
  
  const teamMembers = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      role: "Kurucu & Genel Müdür",
      imageUrl: "https://i.pravatar.cc/150?img=1",
      description: "Blockchain ve kripto para uzmanı, 10 yıllık teknoloji deneyimi",
      skills: ["Blockchain", "Finans", "Strateji"],
      socialLinks: {
        twitter: "https://twitter.com/ahmetyilmaz",
        linkedin: "https://linkedin.com/in/ahmetyilmaz",
        github: "https://github.com/ahmetyilmaz"
      }
    },
    {
      id: 2,
      name: "Ayşe Demir",
      role: "Baş Teknoloji Sorumlusu",
      imageUrl: "https://i.pravatar.cc/150?img=5",
      description: "Yazılım geliştirme ve mimari tasarım konusunda uzman",
      skills: ["React", "Solidity", "Backend"],
      socialLinks: {
        twitter: "https://twitter.com/aysedemir",
        linkedin: "https://linkedin.com/in/aysedemir",
        github: "https://github.com/aysedemir"
      }
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      role: "Pazarlama Direktörü",
      imageUrl: "https://i.pravatar.cc/150?img=3",
      description: "Dijital pazarlama ve büyüme stratejileri konusunda deneyimli",
      skills: ["Pazarlama", "Sosyal Medya", "İçerik"],
      socialLinks: {
        twitter: "https://twitter.com/mehmetkaya",
        linkedin: "https://linkedin.com/in/mehmetkaya",
        github: null
      }
    },
    {
      id: 4,
      name: "Zeynep Şahin",
      role: "Ürün Yöneticisi",
      imageUrl: "https://i.pravatar.cc/150?img=8",
      description: "Kullanıcı deneyimi ve ürün geliştirme alanında uzman",
      skills: ["UI/UX", "Ürün Yönetimi", "Analitik"],
      socialLinks: {
        twitter: "https://twitter.com/zeynepsahin",
        linkedin: "https://linkedin.com/in/zeynepsahin",
        github: null
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <TeamHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border border-purple-800/30 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Users className="h-7 w-7 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-100">Takım Vizyonumuz</h3>
              <p className="text-gray-300">Blockchain teknolojisini herkes için erişilebilir kılarak dijital dünyanın geleceğini şekillendirmek.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-indigo-800/30 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 p-3 rounded-full bg-indigo-500/20 border border-indigo-500/30">
              <Award className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-100">Değerlerimiz</h3>
              <p className="text-gray-300">Şeffaflık, yenilikçilik ve topluluk odaklı yaklaşımla hareket ediyoruz.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-100">
        <Star className="h-5 w-5 text-purple-400" />
        <span>Takım Üyelerimiz</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map(member => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
      
      <Card className="border border-cyan-800/30 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm mt-8">
        <CardContent className="p-6 flex items-center">
          <div className="mr-4 p-3 rounded-full bg-cyan-500/20 border border-cyan-500/30">
            <ShieldCheck className="h-7 w-7 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cyan-100">Bize Katılın</h3>
            <p className="text-gray-300 mb-4">Projemize katkıda bulunmak ve ekibimizin bir parçası olmak ister misiniz?</p>
            <a href="mailto:team@example.com" className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-500 hover:to-blue-500 transition-all">
              İletişime Geçin
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
