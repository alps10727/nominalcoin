
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";

interface ReferralListProps {
  referrals: string[];
}

const ReferralList = ({ referrals }: ReferralListProps) => {
  if (referrals.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Davet Ettiğin Kişiler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {referrals.map((userId, index) => (
            <div key={userId} className="flex items-center justify-between p-2 bg-gray-800/40 rounded">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2">
                  {index + 1}
                </div>
                <div className="text-sm text-white">Kullanıcı {userId.substring(0, 6)}...</div>
              </div>
              <div className="text-sm text-green-400">+{REFERRAL_BONUS_RATE} NC/dk</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralList;
