import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { FormConfig } from "@/types/form.types";
import { buildFormSchema, getFormDefaultValues } from "@/utils/formValidation";
import { Form } from "../ui/form";
import DynamicField from "./DynamicField";
import { Button } from "../ui/button";
import { FormApiService } from "@/services/formApi";
import Header from "./Header";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormRendererProps {
  formId: string;
  useMockApi?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  onSuccess?: (response: unknown) => void;
  onError?: (error: Error) => void;
  onFormLoad?: (config: FormConfig) => void;
}

/**
 * Main form renderer component that fetches and renders dynamic forms
 */
const FormRenderer = ({
  formId,
  useMockApi = false,
  onSubmit,
  onSuccess,
  onError,
  onFormLoad,
}: FormRendererProps) => {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch form configuration
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);
        // FormApiService now returns FormConfig directly (already transformed)
        const config = await FormApiService.fetchFormConfig(formId, useMockApi);
        setFormConfig(config);

        // Notify parent component that form is loaded
        if (onFormLoad) {
          onFormLoad(config);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load form";
        setError(errorMessage);
        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, useMockApi]);

  // Build schema and get default values when form config is loaded
  const schema = formConfig ? buildFormSchema(formConfig.questions) : null;
  const defaultValues = formConfig
    ? getFormDefaultValues(formConfig.questions)
    : {};

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  // Watch all form values for conditional field logic
  const formValues = form.watch();

  // Handle form submission
  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setSubmitting(true);

      // If custom onSubmit is provided, use it
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Otherwise, submit to the API with proper formatting
        const result = await FormApiService.submitForm(
          formId,
          data,
          useMockApi,
          formConfig || undefined
        );

        if (result.success) {
          if (onSuccess) {
            onSuccess(result.data);
          }
          form.reset();
        } else {
          throw new Error(result.message || "Failed to submit form");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit form";
      setError(errorMessage);
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Check if a field should be displayed based on dependencies
  const shouldDisplayField = (
    question: FormConfig["questions"][0]
  ): boolean => {
    if (!question.dependsOn) return true;

    const dependentValue = formValues[question.dependsOn.field];
    return dependentValue === question.dependsOn.value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading form...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive text-sm font-medium">
          Error loading form
        </p>
        <p className="text-destructive/80 text-sm">{error}</p>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="text-muted-foreground text-center p-8">
        No form configuration found
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-0">
      {/* Form Header */}
      {formConfig.title && (
        <Header title={formConfig.title} description={formConfig.description} />
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="bg-white shadow-md rounded-b-lg p-6 space-y-6"
        >
          {/* Render with pages if available, otherwise flat questions */}
          {formConfig.pages ? (
            <>
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {formConfig.pages.length}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {formConfig.pages[currentPage]?.name}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentPage + 1) / formConfig.pages.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Page */}
              <div className="space-y-6">
                {/* Page Title */}
                {formConfig.pages[currentPage]?.name && (
                  <div className="pb-2 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formConfig.pages[currentPage].name}
                    </h3>
                  </div>
                )}

                {/* Page Questions */}
                <div className="space-y-6">
                  {formConfig.pages[currentPage]?.questions
                    .filter(shouldDisplayField)
                    .map((question) => (
                      <DynamicField
                        key={question.id}
                        question={question}
                        control={form.control}
                      />
                    ))}
                </div>
              </div>

              {/* Page Navigation */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={submitting}
                  >
                    Reset
                  </Button>
                </div>

                <div className="flex gap-2">
                  {/* Previous Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0 || submitting}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  {/* Next or Submit Button */}
                  {currentPage < formConfig.pages.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(formConfig.pages!.length - 1, prev + 1)
                        )
                      }
                      disabled={submitting}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Fallback: Render flat questions without pages
            <>
              {formConfig.questions.filter(shouldDisplayField).map((question) => (
                <DynamicField
                  key={question.id}
                  question={question}
                  control={form.control}
                />
              ))}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={submitting}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </>
          )}
        </form>
        <div className="mt-4 flex items-center justify-center gap-2">
          <p className="text-2xl font-bold text-gray-700">Insyt Web</p>
          <p className="text-2xl font-normal text-gray-700"> Forms</p>
        </div>
      </Form>

      {/* Success/Error Messages */}
      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FormRenderer;
