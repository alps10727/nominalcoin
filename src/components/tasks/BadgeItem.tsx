
import React from "react";
import { Badge } from "@/types/tasks";
import { cn } from "@/lib/utils";

interface BadgeItemProps {
  badge: Badge;
}

const BadgeItem = ({ badge }: BadgeItemProps) => {
  const IconComponent = badge.icon.type;
  
  return (
    <div className="bg-navy-800/50 border border-navy-700 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            badge.earned ? "bg-teal-900/50" : "bg-navy-700/50"
          )}>
            <IconComponent {...badge.icon.props} />
          </div>
          <div className="ml-3">
            <h3 className={cn(
              "text-sm font-medium",
              badge.earned ? "text-teal-400" : "text-gray-300"
            )}>
              {badge.title}
            </h3>
            <p className="text-xs text-gray-400">{badge.description}</p>
          </div>
        </div>

        <div className="w-full bg-navy-700 h-2 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              badge.earned ? "bg-gradient-to-r from-teal-500 to-emerald-400" : "bg-blue-600"
            )}
            style={{ width: `${badge.progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between items-center text-xs">
          <span className={badge.earned ? "text-teal-400" : "text-gray-400"}>
            {badge.earned ? "Completed" : `${Math.round(badge.progress)}%`}
          </span>
          {badge.earned && (
            <span className="text-teal-400 font-medium">✓ Earned</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeItem;
