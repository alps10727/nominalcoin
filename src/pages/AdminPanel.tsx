
import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Database, 
  Settings, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const adminSections = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage user accounts and permissions",
      key: "users"
    },
    {
      icon: Activity,
      title: "Mining Analytics",
      description: "View mining performance and trends",
      key: "mining"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Database operations and backups",
      key: "data"
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Application settings and configurations",
      key: "settings"
    }
  ];

  return (
    <div className="min-h-screen fc-space-bg p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold fc-gradient-text mb-6">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {adminSections.map((section) => (
            <Card 
              key={section.key} 
              className={`fc-glass-panel hover:border-purple-500/50 transition-all 
                ${activeSection === section.key ? 'border-purple-500' : ''}`}
              onClick={() => setActiveSection(section.key)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <section.icon className="h-6 w-6 text-purple-400" />
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
