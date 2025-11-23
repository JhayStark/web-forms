import { useState, useCallback } from "react";
import FormRenderer from "../form/FormRenderer";
import { Button } from "../ui/button";
import { formatFormResponse } from "@/utils/responseFormatter";
import type { FormConfig } from "@/types/form.types";

/**
 * Example component demonstrating how to use the FormRenderer
 * Shows both raw form values and formatted API submission side-by-side
 */
const FormExample = () => {
  const [selectedFormId, setSelectedFormId] = useState<string>("contact-form-001");
  const [rawData, setRawData] = useState<Record<string, unknown> | null>(null);
  const [formattedData, setFormattedData] = useState<string | null>(null);
  const [currentFormConfig, setCurrentFormConfig] = useState<FormConfig | null>(null);
  const [showFormatted, setShowFormatted] = useState(true);

  // Store form config when form loads
  const handleFormLoad = useCallback((config: FormConfig) => {
    setCurrentFormConfig(config);
  }, []);

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    console.log("Raw form data:", data);
    setRawData(data);

    // Format the data using the same formatter that production uses
    if (currentFormConfig) {
      const formatted = formatFormResponse({
        formId: selectedFormId,
        formConfig: currentFormConfig,
        formData: data,
        timeSpent: 120000, // Example: 2 minutes
        version: "25012211562956",
        labels: {
          imageLabel: "example-submission",
          label1: (data.firstName as string) || (data.fullName as string) || "no_res_!@#$%",
          label2: (data.lastName as string) || "no_res_!@#$%",
        },
      });

      console.log("Formatted API submission:", formatted);
      setFormattedData(JSON.stringify(formatted, null, 2));
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Form submitted! Check the output below.");
  };

  const handleSuccess = useCallback((response: unknown) => {
    console.log("Submission successful:", response);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error("Form error:", error);
    alert(`Error: ${error.message}`);
  }, []);

  const resetForm = () => {
    setRawData(null);
    setFormattedData(null);
  };

  const handleFormChange = (formId: string) => {
    setSelectedFormId(formId);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Form Selector */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Dynamic Form Renderer</h1>
            <p className="text-muted-foreground">
              Select a form to render and submit to see both raw and formatted API output
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFormId === "contact-form-001" ? "default" : "outline"}
              onClick={() => handleFormChange("contact-form-001")}
            >
              Contact Form
            </Button>
            <Button
              variant={selectedFormId === "survey-form-001" ? "default" : "outline"}
              onClick={() => handleFormChange("survey-form-001")}
            >
              Survey Form
            </Button>
            <Button
              variant={
                selectedFormId === "registration-form-001" ? "default" : "outline"
              }
              onClick={() => handleFormChange("registration-form-001")}
            >
              Registration Form
            </Button>
            <Button
              variant={selectedFormId === "qrcode-form-001" ? "default" : "outline"}
              onClick={() => handleFormChange("qrcode-form-001")}
            >
              QR Code Scanner
            </Button>
            <Button
              variant={selectedFormId === "farmer-profile-001" ? "default" : "outline"}
              onClick={() => handleFormChange("farmer-profile-001")}
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
            useMockApi={true}
            onFormLoad={handleFormLoad}
            onSubmit={handleFormSubmit}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        {/* Output Toggle */}
        {(rawData || formattedData) && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={!showFormatted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFormatted(false)}
            >
              Raw Form Data
            </Button>
            <Button
              variant={showFormatted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFormatted(true)}
            >
              Formatted API Submission
            </Button>
          </div>
        )}

        {/* Raw Data Display */}
        {rawData && !showFormatted && (
          <div className="rounded-lg border bg-muted p-6">
            <h3 className="text-lg font-semibold mb-2">
              Raw Form Data (from react-hook-form)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is the raw data collected from form fields before formatting:
            </p>
            <pre className="overflow-auto text-sm bg-background p-4 rounded border">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        )}

        {/* Formatted Data Display */}
        {formattedData && showFormatted && (
          <div className="rounded-lg border border-green-500 bg-card p-6">
            <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-400">
              Formatted API Submission (Production Format)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is the formatted structure that gets sent to the production API.
              This format is automatically applied when FormRenderer submits without a custom onSubmit handler.
            </p>
            <pre className="overflow-auto text-sm bg-background p-4 rounded border">
              {formattedData}
            </pre>
          </div>
        )}

        {/* Information Box */}
        {(rawData || formattedData) && (
          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-6">
            <h3 className="text-lg font-semibold mb-2">How It Works</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>In this example:</strong> We manually call{" "}
                <code className="bg-muted px-1 py-0.5 rounded">formatFormResponse()</code>{" "}
                to show both raw and formatted outputs side-by-side.
              </p>
              <p>
                <strong>In production:</strong> When using{" "}
                <code className="bg-muted px-1 py-0.5 rounded">&lt;FormRenderer formId="12935" /&gt;</code>{" "}
                without a custom onSubmit handler, the formatting happens automatically before submitting
                to the API.
              </p>
              <p className="mt-4">
                See{" "}
                <code className="bg-muted px-1 py-0.5 rounded">SUBMISSION_FORMAT.md</code>{" "}
                for detailed documentation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormExample;
