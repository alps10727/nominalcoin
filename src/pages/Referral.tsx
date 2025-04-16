
import React from "react";
import ReferralCard from "@/components/referral/ReferralCard";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Share2, Gift, TrendingUp, Users } from "lucide-react";

const Referral = () => {
  const { currentUser, loading } = useAuth();

  // Kullanıcı giriş yapmamışsa, giriş yapmaya yönlendir
  if (!loading && !currentUser) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              Referans Sistemi
            </CardTitle>
            <CardDescription>
              Arkadaşlarınızı davet edin ve birlikte kazanın!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center py-8">
              Referans sistemi özelliklerini kullanmak için lütfen giriş yapın.
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <Link to="/sign-in">Giriş Yap</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Referans Sistemi</h1>
      
      <div className="grid gap-6">
        {/* Ana Referans Kartı */}
        <ReferralCard />
        
        {/* Bilgi Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5 text-blue-500" />
                Nasıl Çalışır?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Referans kodunuzu arkadaşlarınızla paylaşın. Onlar kaydolurken 
                bu kodu girdiğinde hem siz hem de onlar bonus kazanır.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gift className="h-5 w-5 text-purple-500" />
                Kazançlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Her davet için <strong>+0.003</strong> madencilik hızı bonusu kazanırsınız.
                Davet ettiğiniz kişi de <strong>+0.001</strong> bonus alır.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Sınırsız Potansiyel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Ne kadar çok kişi davet ederseniz, madencilik hızınız o kadar artar.
                Sınır yok! Daha fazla davet = Daha hızlı kazanç.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Referral;
