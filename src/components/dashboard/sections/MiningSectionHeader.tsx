
import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, ChevronRight } from "lucide-react";

export const MiningSectionHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-purple-200 flex items-center">
        <Zap className="h-5 w-5 mr-1.5 text-purple-400" />
        Mining Hub
      </h2>
      
      <Button variant="link" size="sm" className="text-purple-400 hover:text-purple-300 -mr-2">
        Boosts <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
