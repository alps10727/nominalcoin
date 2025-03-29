
import { CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface FormFooterProps {
  text: string;
  linkText: string;
  linkPath: string;
}

const FormFooter = ({ text, linkText, linkPath }: FormFooterProps) => {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <div className="text-center text-sm">
        {text}{" "}
        <Link to={linkPath} className="text-primary hover:underline">
          {linkText}
        </Link>
      </div>
    </CardFooter>
  );
};

export default FormFooter;
