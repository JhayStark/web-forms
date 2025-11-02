import type { ApiFormConfig } from "@/types/api.types";
import {
  apiSampleContactForm,
  apiSampleSurveyForm,
  apiSampleRegistrationForm,
  apiSampleQRCodeForm,
} from "@/mocks/apiSampleData";
import { realApiFarmerProfileForm } from "@/mocks/realApiSampleData";

/**
 * Mock API service for development and testing
 * Returns data in API format (matching your actual API structure)
 */
export class MockFormApiService {
  private static readonly forms: Record<string, any> = {
    "contact-form-001": apiSampleContactForm,
    "survey-form-001": apiSampleSurveyForm,
    "registration-form-001": apiSampleRegistrationForm,
    "qrcode-form-001": apiSampleQRCodeForm,
    "farmer-profile-001": realApiFarmerProfileForm,
  };

  /**
   * Simulate fetching form configuration from API
   * Returns API format
   */
  static async fetchFormConfig(formId: string): Promise<ApiFormConfig> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const form = this.forms[formId];

    if (!form) {
      throw new Error(`Form with id "${formId}" not found`);
    }

    return form;
  }

  /**
   * Simulate submitting form to API
   */
  static async submitForm(
    formId: string,
    responses: Record<string, unknown>
  ): Promise<{ success: boolean; message?: string; data?: unknown }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Simulated network error");
    }

    console.log(`Form ${formId} submitted with responses:`, responses);

    return {
      success: true,
      message: "Form submitted successfully",
      data: {
        submissionId: `sub-${Date.now()}`,
        formId,
        responses,
        submittedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Simulate fetching all forms
   */
  static async fetchForms(): Promise<ApiFormConfig[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return Object.values(this.forms);
  }
}
