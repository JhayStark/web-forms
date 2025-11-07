import type { ApiQuestion } from "@/types/api.types";
import type { FormConfig, FormPage } from "@/types/form.types";

/**
 * Your actual API response structure
 */
interface RealApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    title: string;
    description?: string;
    posted_by?: string;
    start_date?: string;
    end_date?: string;
    expiry_date?: string;
    active_data: {
      pages: Array<{
        name?: string;
        type?: string;
        questions: Array<RealApiQuestion>;
      }>;
    };
  };
}

interface RealApiQuestion {
  id: string;
  type: string;
  index: number;
  title: string;
  hint?: string;
  source: {
    editable: boolean;
  };
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    regex?: string;
    acceptDecimal?: boolean;
  };
  options?: Array<{
    key: string;
    value: string;
    count?: number;
    isOther?: boolean;
  }>;
  tree?: unknown[];
  countryCode?: string;
  dependencies?: {
    logic: string;
    rules: Array<{
      qid: string;
      filter: string;
      values: string[];
    }>;
    action: string;
  };
  keyword_label?: string;
  keyword_value?: string;
  useAsSummary?: boolean;
  disable_gallery?: boolean;
  unit?: string;
  inline?: boolean;
  collapse?: boolean;
}

/**
 * Transform your real API response to the internal format
 */
export function transformRealApiResponse(response: RealApiResponse): FormConfig {
  // Transform pages with their questions
  const pages: FormPage[] = response.data.active_data.pages.map((page) => {
    // Sort questions within the page by index
    const sortedQuestions = [...page.questions].sort((a, b) => a.index - b.index);

    return {
      name: page.name || "Page",
      questions: sortedQuestions.map((q) => {
        const apiQuestion = transformRealQuestion(q);
        return {
          id: apiQuestion.id,
          name: apiQuestion.id,
          label: apiQuestion.title,
          type: apiQuestion.type as any,
          placeholder: apiQuestion.placeholder,
          description: apiQuestion.description,
          defaultValue: apiQuestion.defaultValue,
          options: apiQuestion.options?.map((opt) => ({
            value: opt.key,
            label: opt.value,
          })),
          validation: transformValidationToRules(apiQuestion.validation),
          disabled: !apiQuestion.source?.editable,
          required: apiQuestion.validation?.required || false,
        };
      }),
    };
  });

  // Also create a flattened questions array for compatibility
  const allQuestions = pages.flatMap((page) => page.questions);

  return {
    id: response.data.id,
    title: response.data.title,
    description: response.data.description || "",
    questions: allQuestions,
    pages: pages, // Include pages structure
    submitUrl: undefined,
  };
}

/**
 * Transform API validation to internal validation rules
 */
function transformValidationToRules(validation?: ApiQuestion["validation"]): any[] {
  if (!validation) return [];

  const rules: any[] = [];

  if (validation.minLength !== undefined) {
    rules.push({
      type: "minLength",
      value: validation.minLength,
      message: `Minimum ${validation.minLength} characters required`,
    });
  }

  if (validation.maxLength !== undefined) {
    rules.push({
      type: "maxLength",
      value: validation.maxLength,
      message: `Maximum ${validation.maxLength} characters allowed`,
    });
  }

  if (validation.min !== undefined) {
    rules.push({
      type: "min",
      value: validation.min,
      message: `Minimum value is ${validation.min}`,
    });
  }

  if (validation.max !== undefined) {
    rules.push({
      type: "max",
      value: validation.max,
      message: `Maximum value is ${validation.max}`,
    });
  }

  if (validation.pattern) {
    rules.push({
      type: "pattern",
      value: validation.pattern,
      message: "Invalid format",
    });
  }

  return rules;
}

function transformRealQuestion(question: RealApiQuestion): ApiQuestion {
  // Map field types to internal types
  let type = question.type;

  // Comprehensive type mapping to internal field types
  const typeMap: Record<string, string> = {
    // Standard types (mapped to internal FieldType)
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
    "multiple-choice": "checkbox-group",
    "date": "date",
    "time": "time",
    "datetime": "datetime-local",
    "file": "file",
    "upload": "file",
    "signature": "signature",
    "location": "location",
    "geolocation": "location",

    // Special/custom types from your API
    "qrcode": "qrcode", // QR code scanner with camera
    "image": "file", // Image upload
    "video": "file", // Video upload
    "audio": "file", // Audio upload
    "polygon": "polygon", // Farm polygon with map picker
    "option-tree": "select", // Hierarchical select - flatten to select
    "sub-form": "text", // Sub-forms - placeholder for now
  };

  type = typeMap[type] || "text";

  // Transform options
  let options: Array<{ key: string; value: string }> | undefined;
  if (question.options) {
    options = question.options.map((opt) => ({
      key: opt.key,
      value: opt.value,
    }));
  }

  // Transform validation
  const validation: ApiQuestion["validation"] = {};
  if (question.validation) {
    validation.required = question.validation.required || false;
    if (question.validation.min !== undefined) {
      validation.min = question.validation.min;
    }
    if (question.validation.max !== undefined) {
      validation.max = question.validation.max;
    }
    if (question.validation.regex) {
      validation.pattern = question.validation.regex;
    }
  }

  return {
    id: question.id,
    type: type,
    index: question.index,
    title: question.title,
    source: {
      editable: question.source?.editable ?? true,
    },
    validation,
    options,
    countryCode: question.countryCode || "GH",
    placeholder: question.hint,
  };
}

/**
 * Check if response is from your real API
 */
export function isRealApiResponse(data: unknown): data is RealApiResponse {
  const response = data as RealApiResponse;
  return (
    response?.statusCode !== undefined &&
    response?.data?.active_data?.pages !== undefined
  );
}
