
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Mail, Edit, Shield, Award, BarChart2, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Profile = () => {
  const { t } = useLanguage();
  const { currentUser, userData } = useAuth();
  const [username, setUsername] = useState("FutureMiner");
  const [avatar, setAvatar] = useState("https://api.dicebear.com/7.x/micah/svg?seed=FutureMiner");
  const [level, setLevel] = useState(3);
  const [totalMined, setTotalMined] = useState(120.5);
  const [joinDate, setJoinDate] = useState("2023-06-15");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  // Get user data from auth context
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || "");
      
      // Get display name or use the first part of email as fallback
      if (currentUser.displayName) {
        setFullName(currentUser.displayName);
      } else if (userData && userData.fullName) {
        setFullName(userData.fullName);
      } else if (email) {
        // Use the part before @ as a fallback name
        setFullName(email.split('@')[0]);
      }
      
      // Update username based on available info
      if (userData && userData.username) {
        setUsername(userData.username);
      } else if (currentUser.displayName) {
        setUsername(currentUser.displayName.split(' ')[0]);
      } else if (email) {
        setUsername(email.split('@')[0]);
      }
      
      // Update avatar to use email for consistency
      if (email) {
        setAvatar(`https://api.dicebear.com/7.x/micah/svg?seed=${email}`);
      }
      
      // Update join date if available in auth
      if (currentUser.metadata && currentUser.metadata.creationTime) {
        setJoinDate(currentUser.metadata.creationTime);
      }
    }
  }, [currentUser, userData, email]);

  const form = useForm({
    defaultValues: {
      username: username,
    },
  });

  const onSubmit = (data: { username: string }) => {
    setUsername(data.username);
    setAvatar(`https://api.dicebear.com/7.x/micah/svg?seed=${data.username}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-blue-900 flex flex-col">
      <Header />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">{t('profile.title')}</h1>
          <p className="text-indigo-200 text-sm">Manage your account settings</p>
        </div>

        {/* Profile Card - Newly Designed */}
        <Card className="mb-5 border-0 shadow-xl bg-gradient-to-br from-indigo-800 to-blue-800 text-white overflow-hidden">
          <div className="relative pb-20 pt-6 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 right-0 h-32 bg-white/5"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full -ml-16 -mb-16 bg-indigo-500/20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 bg-blue-500/20"></div>
            </div>

            {/* User Info */}
            <div className="relative flex items-center z-10">
              <Avatar className="h-20 w-20 border-4 border-indigo-400/30 shadow-lg">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="bg-indigo-700">{username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold text-white">{username}</h2>
                {fullName && fullName !== username && (
                  <p className="text-indigo-200 text-sm">{fullName}</p>
                )}
                <div className="mt-1 flex items-center text-indigo-200 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Joined {new Date(joinDate).toLocaleDateString()}</span>
                </div>
                {email && (
                  <div className="flex items-center text-indigo-200 text-xs mt-0.5">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>{email}</span>
                  </div>
                )}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-indigo-600/30 hover:bg-indigo-500/50 text-white">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-indigo-900 text-white border-indigo-700">
                  <DialogHeader>
                    <DialogTitle>{t('profile.edit')}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-indigo-200">Username</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-indigo-800/50 border-indigo-600 text-white" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500">
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* User Stats */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-900/80 to-blue-900/80 backdrop-blur-sm p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-indigo-300 text-xs font-medium">{t('profile.totalMined')}</span>
                  <span className="text-xl font-bold text-white">{totalMined.toFixed(2)} FC</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-indigo-300 text-xs font-medium">{t('profile.level')}</span>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-white mr-2">{level}</span>
                    <div className="w-12 bg-indigo-800/50 rounded-full h-1.5">
                      <div className="bg-indigo-400 h-1.5 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-white mb-2">Account Settings</h2>
          
          <MenuLink 
            to="/security" 
            icon={Shield} 
            title="Security" 
            description="Manage account password & security" 
          />
          
          <MenuLink 
            to="/stats" 
            icon={BarChart2} 
            title="Statistics" 
            description="View your mining performance" 
          />
          
          <MenuLink 
            to="/achievements" 
            icon={Award} 
            title="Achievements" 
            description="View your badges and rewards" 
          />
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
};

// Yeni bileşen - Menü bağlantısı
const MenuLink = ({ to, icon: Icon, title, description }: { 
  to: string; 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => {
  return (
    <Link to={to}>
      <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-indigo-800/90 to-blue-800/90 hover:from-indigo-700/90 hover:to-blue-700/90">
        <CardContent className="p-4 flex items-center">
          <div className="p-2.5 rounded-xl bg-indigo-700/50 mr-3 border border-indigo-500/40">
            <Icon className="h-5 w-5 text-indigo-200" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">{title}</h3>
            <p className="text-indigo-300 text-xs">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-indigo-400/70" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default Profile;
