
import React from 'react';
import { CheckCircle, TrendingUp, ShoppingCart, Clock } from "lucide-react";

interface MissionIconProps {
  iconName: string;
}

const MissionIcon = ({ iconName }: MissionIconProps) => {
  switch (iconName) {
    case 'trending-up':
      return <TrendingUp className="h-5 w-5 text-green-400" />;
    case 'shopping-cart':
      return <ShoppingCart className="h-5 w-5 text-purple-400" />;
    case 'clock':
      return <Clock className="h-5 w-5 text-blue-400" />;
    default:
      return <CheckCircle className="h-5 w-5 text-blue-400" />;
  }
};

export default MissionIcon;
