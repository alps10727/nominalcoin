
import React from "react";
import { Users } from "lucide-react";

const TeamHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30">
          <Users className="h-6 w-6 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
          Takımımız
        </h1>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6 mb-8">
        <h2 className="text-xl text-purple-100 font-semibold mb-2">Vizyoner Ekibimizle Tanışın</h2>
        <p className="text-gray-300">
          Blockchain teknolojisinde uzmanlaşmış, yenilikçi ve tutkulu ekibimiz, projenin her aşamasında değer katmak için çalışıyor. 
          Farklı alanlardaki deneyimlerimizle en iyi kullanıcı deneyimini sunmayı hedefliyoruz.
        </p>
      </div>
    </div>
  );
};

export default TeamHeader;
