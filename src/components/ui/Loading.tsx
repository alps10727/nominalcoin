
import React from 'react';
import { RotateCw } from 'lucide-react';

const Loading = ({ message = "Yükleniyor..." }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RotateCw className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
