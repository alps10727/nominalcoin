
import React from "react";

interface NotificationItemProps {
  title: string;
  description: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{title}</span>
      <span className="text-xs text-gray-400">{description}</span>
    </div>
  );
};
