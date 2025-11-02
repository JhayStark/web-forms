import type { FormSubmissionData, FormConfig } from "@/types/form.types";
import type { ApiFormConfig } from "@/types/api.types";
import { MockFormApiService } from "./mockFormApi";
import { transformApiFormConfig } from "@/utils/apiAdapter";
import { isRealApiResponse, transformRealApiResponse } from "@/utils/realApiAdapter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true" || !import.meta.env.VITE_API_BASE_URL;

export class FormApiService {
  /**
   * Fetch form configuration and questions from the API
   * Automatically detects and transforms both standard and real API formats
   */
  static async fetchFormConfig(formId: string): Promise<FormConfig> {
    // Use mock API in development
    if (USE_MOCK_API) {
      const mockData = await MockFormApiService.fetchFormConfig(formId);
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

      // Otherwise use the standard adapter
      return transformApiFormConfig(data as ApiFormConfig);
    } catch (error) {
      console.error("Error fetching form config:", error);
      throw error;
    }
  }

  /**
   * Submit form responses to the API
   */
  static async submitForm(
    formId: string,
    responses: Record<string, unknown>
  ): Promise<{ success: boolean; message?: string; data?: unknown }> {
    // Use mock API in development
    if (USE_MOCK_API) {
      return MockFormApiService.submitForm(formId, responses);
    }

    try {
      const submissionData: FormSubmissionData = {
        formId,
        responses,
        submittedAt: new Date().toISOString(),
      };

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
   * Fetch multiple forms (for listing)
   */
  static async fetchForms(): Promise<FormConfig[]> {
    // Use mock API in development
    if (USE_MOCK_API) {
      const mockData = await MockFormApiService.fetchForms();
      return mockData.map(transformApiFormConfig);
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
