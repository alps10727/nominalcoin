
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlobalChat from "@/components/chat/GlobalChat";
import ReferralChat from "@/components/chat/ReferralChat";

const Chat = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Sohbet</h1>
      
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="global" className="flex-1">Global Sohbet</TabsTrigger>
          <TabsTrigger value="referral" className="flex-1">Referans Sohbeti</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global">
          <Card className="p-4">
            <GlobalChat />
          </Card>
        </TabsContent>
        
        <TabsContent value="referral">
          <Card className="p-4">
            <ReferralChat />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Chat;
