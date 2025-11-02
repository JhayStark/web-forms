import { useParams } from "react-router-dom";
import FormRenderer from "@/components/form/FormRenderer";

const FormPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <FormRenderer formId={id || ""} />
      </div>
    </div>
  );
};

export default FormPage;
