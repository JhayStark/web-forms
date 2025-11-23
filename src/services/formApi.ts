import type { FormConfig } from "@/types/form.types";
import type { ApiFormConfig } from "@/types/api.types";
import { MockFormApiService } from "./mockFormApi";
import { transformApiFormConfig } from "@/utils/apiAdapter";
import { isRealApiResponse, transformRealApiResponse } from "@/utils/realApiAdapter";
import { formatFormResponse } from "@/utils/responseFormatter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export class FormApiService {
  /**
   * Fetch form configuration and questions from the API
   * Automatically detects and transforms both standard and real API formats
   * @param formId - The ID of the form to fetch
   * @param useMockApi - Whether to use mock API (defaults to environment variable)
   */
  static async fetchFormConfig(formId: string, useMockApi?: boolean): Promise<FormConfig> {
    // Determine whether to use mock API
    const shouldUseMock = useMockApi ?? (import.meta.env.VITE_USE_MOCK_API === "true" || !import.meta.env.VITE_API_BASE_URL);

    // Use mock API in development or when explicitly requested
    if (shouldUseMock) {
      const mockData = await MockFormApiService.fetchFormConfig(formId);

      // Check if it's the real API format (nested pages structure)
      if (isRealApiResponse(mockData)) {
        return transformRealApiResponse(mockData);
      }

      return transformApiFormConfig(mockData);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forms/${formId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch form: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if it's the real API format (nested pages structure)
      if (isRealApiResponse(data)) {
        return transformRealApiResponse(data);
      }

      // Validate that we have questions array before transforming
      if (!data.questions || !Array.isArray(data.questions)) {
        console.error("Invalid form data structure:", data);
        throw new Error("Invalid form data: missing or invalid questions array");
      }

      // Otherwise use the standard adapter
      return transformApiFormConfig(data as ApiFormConfig);
    } catch (error) {
      console.error("Error fetching form config:", error);
      throw error;
    }
  }

  /**
   * Submit form responses to the API
   * @param formId - The ID of the form to submit
   * @param responses - The form responses
   * @param useMockApi - Whether to use mock API (defaults to environment variable)
   * @param formConfig - Optional form config for proper formatting (if available)
   */
  static async submitForm(
    formId: string,
    responses: Record<string, unknown>,
    useMockApi?: boolean,
    formConfig?: FormConfig
  ): Promise<{ success: boolean; message?: string; data?: unknown }> {
    // Determine whether to use mock API
    const shouldUseMock = useMockApi ?? (import.meta.env.VITE_USE_MOCK_API === "true" || !import.meta.env.VITE_API_BASE_URL);

    // Use mock API in development or when explicitly requested
    if (shouldUseMock) {
      return MockFormApiService.submitForm(formId, responses);
    }

    try {
      // If formConfig is provided, use the formatted submission
      let submissionData: any;

      if (formConfig) {
        submissionData = formatFormResponse({
          formId,
          formConfig,
          formData: responses,
        });
      } else {
        // Fallback to legacy format if no formConfig
        submissionData = {
          formId,
          responses,
          submittedAt: new Date().toISOString(),
        };
      }

      const response = await fetch(`${API_BASE_URL}/forms/${formId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error submitting form:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit form",
      };
    }
  }

  /**
   * Submit form responses using the proper API format
   * This formats the response to match the expected API structure
   */
  static async submitFormattedResponse(
    formId: string,
    formConfig: FormConfig,
    responses: Record<string, unknown>,
    options?: {
      timeSpent?: number;
      version?: string;
      labels?: {
        imageLabel?: string;
        label1?: string;
        label2?: string;
      };
    }
  ): Promise<{ success: boolean; message?: string; data?: unknown }> {
    try {
      // Format the response to match API structure
      const formattedResponse = formatFormResponse({
        formId,
        formConfig,
        formData: responses,
        timeSpent: options?.timeSpent,
        version: options?.version,
        labels: options?.labels,
      });

      const response = await fetch(`${API_BASE_URL}/forms/${formId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedResponse),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error submitting form:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit form",
      };
    }
  }

  /**
   * Fetch multiple forms (for listing)
   * @param useMockApi - Whether to use mock API (defaults to environment variable)
   */
  static async fetchForms(useMockApi?: boolean): Promise<FormConfig[]> {
    // Determine whether to use mock API
    const shouldUseMock = useMockApi ?? (import.meta.env.VITE_USE_MOCK_API === "true" || !import.meta.env.VITE_API_BASE_URL);

    // Use mock API in development or when explicitly requested
    if (shouldUseMock) {
      const mockData = await MockFormApiService.fetchForms();
      return mockData.map((item) => {
        if (isRealApiResponse(item)) {
          return transformRealApiResponse(item);
        }
        return transformApiFormConfig(item as ApiFormConfig);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forms`);

      if (!response.ok) {
        throw new Error(`Failed to fetch forms: ${response.statusText}`);
      }

      const data = await response.json();

      // If the response is an array, transform each item
      if (Array.isArray(data)) {
        return data.map((item) => {
          if (isRealApiResponse(item)) {
            return transformRealApiResponse(item);
          }
          return transformApiFormConfig(item as ApiFormConfig);
        });
      }

      // If the response is a single object (like the real API format)
      if (isRealApiResponse(data)) {
        return [transformRealApiResponse(data)];
      }

      return [transformApiFormConfig(data as ApiFormConfig)];
    } catch (error) {
      console.error("Error fetching forms:", error);
      throw error;
    }
  }
}
