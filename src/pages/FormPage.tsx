import { useParams } from "react-router-dom";
import FormRenderer from "@/components/form/FormRenderer";

/**
 * Production form page - uses real API by default
 * Access via /form/:id route
 */
const FormPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        {/* useMockApi defaults to false, will use real API unless VITE_USE_MOCK_API is set */}
        <FormRenderer formId={id || ""} />
      </div>
    </div>
  );
};

export default FormPage;
