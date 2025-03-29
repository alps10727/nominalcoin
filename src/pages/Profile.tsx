
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, BarChart2, Edit, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('profile.title')}</h1>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-gray-800 text-gray-100 dark:bg-gray-850">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-700">
                <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {level}
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-indigo-200">{username}</CardTitle>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{t('profile.joinDate')}: {new Date(joinDate).toLocaleDateString()}</span>
              </div>
              {email && (
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{email}</span>
                </div>
              )}
              {fullName && fullName !== username && (
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <User className="h-4 w-4 mr-1" />
                  <span>{fullName}</span>
                </div>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-gray-700 hover:bg-indigo-700">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
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
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-indigo-400 mb-2">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{t('profile.totalMined')}</span>
                </div>
                <p className="text-2xl font-bold text-white">{totalMined.toFixed(2)} FC</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-indigo-400 mb-2">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{t('profile.level')}</span>
                </div>
                <p className="text-2xl font-bold text-white">{level}</p>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Profile;
