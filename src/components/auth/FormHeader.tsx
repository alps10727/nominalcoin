
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";

interface FormHeaderProps {
  title: string;
  description: string;
}

const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <CardHeader className="space-y-1 text-center">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
