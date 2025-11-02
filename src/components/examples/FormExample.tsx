import { useState } from "react";
import FormRenderer from "../form/FormRenderer";
import { Button } from "../ui/button";

/**
 * Example component demonstrating how to use the FormRenderer
 */
const FormExample = () => {
  const [selectedFormId, setSelectedFormId] = useState<string>("contact-form-001");
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(
    null
  );

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
    setSubmittedData(data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Form submitted successfully!");
  };

  const handleSuccess = (response: unknown) => {
    console.log("Submission successful:", response);
  };

  const handleError = (error: Error) => {
    console.error("Form error:", error);
    alert(`Error: ${error.message}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Form Selector */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Dynamic Form Renderer</h1>
          <p className="text-muted-foreground">
            Select a form to render dynamically from API data
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFormId === "contact-form-001" ? "default" : "outline"}
              onClick={() => setSelectedFormId("contact-form-001")}
            >
              Contact Form
            </Button>
            <Button
              variant={selectedFormId === "survey-form-001" ? "default" : "outline"}
              onClick={() => setSelectedFormId("survey-form-001")}
            >
              Survey Form
            </Button>
            <Button
              variant={
                selectedFormId === "registration-form-001" ? "default" : "outline"
              }
              onClick={() => setSelectedFormId("registration-form-001")}
            >
              Registration Form
            </Button>
            <Button
              variant={selectedFormId === "qrcode-form-001" ? "default" : "outline"}
              onClick={() => setSelectedFormId("qrcode-form-001")}
            >
              QR Code Scanner
            </Button>
            <Button
              variant={selectedFormId === "farmer-profile-001" ? "default" : "outline"}
              onClick={() => setSelectedFormId("farmer-profile-001")}
            >
              Farmer Profile (Pages)
            </Button>
          </div>
        </div>

        {/* Form Renderer */}
        <div className="rounded-lg border bg-card p-6">
          <FormRenderer
            key={selectedFormId}
            formId={selectedFormId}
            onSubmit={handleFormSubmit}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        {/* Submitted Data Display */}
        {submittedData && (
          <div className="rounded-lg border bg-muted p-6">
            <h3 className="text-lg font-semibold mb-4">Submitted Data</h3>
            <pre className="overflow-auto text-sm">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormExample;
