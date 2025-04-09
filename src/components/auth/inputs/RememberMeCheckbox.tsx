
import { Checkbox } from "@/components/ui/checkbox";

interface RememberMeCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const RememberMeCheckbox = ({ 
  checked, 
  onCheckedChange, 
  disabled = false 
}: RememberMeCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={checked}
        onCheckedChange={(checked) => {
          onCheckedChange(checked as boolean);
        }}
        disabled={disabled}
      />
      <label
        htmlFor="remember"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Beni hatırla
      </label>
    </div>
  );
};

export default RememberMeCheckbox;
