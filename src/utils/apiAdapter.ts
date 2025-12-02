import type { ApiFormConfig, ApiQuestion } from "@/types/api.types";
import type { FormConfig, FormQuestion, FieldType, ValidationRule } from "@/types/form.types";

/**
 * Map API field types to internal field types
 */
function mapFieldType(apiType: string): FieldType {
  const typeMap: Record<string, FieldType> = {
    "text": "text",
    "phone": "tel",
    "email": "email",
    "password": "password",
    "number": "number",
    "url": "url",
    "textarea": "textarea",
    "single-select": "select",
    "multi-select": "multiselect",
    "radio": "radio",
    "checkbox": "checkbox",
    "checkbox-group": "checkbox-group",
    "multiple-choice": "checkbox-group", // Alternative name
    "date": "date",
    "time": "time",
    "datetime": "datetime-local",
    "file": "file",
    "upload": "file", // Alternative name
    "signature": "signature",
    "location": "location",
    "geolocation": "location", // Alternative name for location
  };

  return typeMap[apiType] || "text";
}

/**
 * Transform API validation format to internal validation rules
 */
function transformValidation(
  apiValidation?: ApiQuestion["validation"],
  isRequired?: boolean
): ValidationRule[] {
  const rules: ValidationRule[] = [];

  if (!apiValidation) return rules;

  // Handle minLength
  if (apiValidation.minLength !== undefined) {
    rules.push({
      type: "minLength",
      value: apiValidation.minLength,
      message: apiValidation.message || `Minimum ${apiValidation.minLength} characters required`,
    });
  }

  // Handle maxLength
  if (apiValidation.maxLength !== undefined) {
    rules.push({
      type: "maxLength",
      value: apiValidation.maxLength,
      message: apiValidation.message || `Maximum ${apiValidation.maxLength} characters allowed`,
    });
  }

  // Handle min (for numbers)
  if (apiValidation.min !== undefined) {
    rules.push({
      type: "min",
      value: apiValidation.min,
      message: apiValidation.message || `Minimum value is ${apiValidation.min}`,
    });
  }

  // Handle max (for numbers)
  if (apiValidation.max !== undefined) {
    rules.push({
      type: "max",
      value: apiValidation.max,
      message: apiValidation.message || `Maximum value is ${apiValidation.max}`,
    });
  }

  // Handle pattern
  if (apiValidation.pattern) {
    rules.push({
      type: "pattern",
      value: apiValidation.pattern,
      message: apiValidation.message || "Invalid format",
    });
  }

  return rules;
}

/**
 * Transform a single API question to internal format
 */
function transformQuestion(apiQuestion: ApiQuestion): FormQuestion {
  const fieldType = mapFieldType(apiQuestion.type);

  return {
    id: apiQuestion.id,
    name: apiQuestion.id, // Use ID as name since API doesn't have separate name field
    label: apiQuestion.title,
    type: fieldType,
    placeholder: apiQuestion.placeholder,
    description: apiQuestion.description,
    defaultValue: apiQuestion.defaultValue,
    options: apiQuestion.options?.map((opt) => ({
      value: opt.key,
      label: opt.value,
    })),
    validation: transformValidation(
      apiQuestion.validation,
      apiQuestion.validation?.required
    ),
    disabled: !apiQuestion.source?.editable,
    required: apiQuestion.validation?.required || false,
    dependsOn: apiQuestion.dependsOn,
  };
}

/**
 * Transform API form configuration to internal format
 */
export function transformApiFormConfig(apiConfig: ApiFormConfig): FormConfig {
  // Defensive check: ensure questions exists and is an array
  if (!apiConfig.questions || !Array.isArray(apiConfig.questions)) {
    console.error("Invalid API config - questions is not an array:", apiConfig);
    throw new Error(`Invalid API configuration: questions must be an array, got ${typeof apiConfig.questions}`);
  }

  // Sort questions by index
  const sortedQuestions = [...apiConfig.questions].sort((a, b) => a.index - b.index);

  return {
    id: apiConfig.id,
    title: apiConfig.title,
    description: apiConfig.description,
    questions: sortedQuestions.map(transformQuestion),
    submitUrl: apiConfig.submitUrl,
  };
}

/**
 * Transform submitted form data back to API format if needed
 */
export function transformSubmissionData(
  formData: Record<string, unknown>,
  questions: ApiQuestion[]
): Record<string, unknown> {
  // You can add any transformations needed for submission here
  // For now, we'll return the data as-is
  return formData;
}

/**
 * Helper to create a sample API response for testing
 */
export function createSampleApiResponse(): ApiFormConfig {
  return {
    id: "sample-form",
    title: "Sample Form",
    description: "This is a sample form from your API",
    questions: [
      {
        id: "2006090713793-8379",
        type: "text",
        index: 0,
        title: "Name",
        source: {
          editable: true,
        },
        validation: {
          required: true,
        },
        countryCode: "GH",
      },
      {
        id: "2006090746912ucPc-8379",
        type: "phone",
        index: 1,
        title: "Phone Number",
        source: {
          editable: true,
        },
        validation: {
          required: true,
        },
        countryCode: "GH",
      },
      {
        id: "2006090759623KAmx-8379",
        type: "single-select",
        index: 2,
        title: "Gender",
        source: {
          editable: true,
        },
        options: [
          {
            key: "Male",
            value: "Male",
          },
          {
            key: "Female",
            value: "Female",
          },
        ],
        countryCode: "GH",
      },
    ],
  };
}
