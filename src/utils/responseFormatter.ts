import type { FormConfig } from "@/types/form.types";
import { v4 as uuidv4 } from "uuid";

/**
 * Response structure that matches the API submission format
 */
export interface FormSubmissionResponse {
  response_data: {
    UUID: string;
    end_date: string;
    formID: string;
    geofence: string;
    gis: boolean;
    gis_data: string;
    isAuto: boolean;
    label: {
      imageLabel: string;
      label1: string;
      label2: string;
    };
    nth: boolean;
    original_gis_data: string;
    profiled: boolean;
    qrCode: Record<string, unknown>;
    questions: QuestionResponse[];
    responseFlag: string;
    source_data: boolean;
    sth: boolean;
    time_spent: string;
    version: string;
  };
  survey_id: string;
}

export interface QuestionResponse {
  id: string;
  type: string;
  value?: unknown;
  values?: unknown[];
  valueProps?: unknown;
  scanner_type?: string;
  verified?: boolean;
  errorMessage?: string;
}

/**
 * Options for formatting the response
 */
export interface ResponseFormatterOptions {
  formId: string;
  formConfig: FormConfig;
  formData: Record<string, unknown>;
  timeSpent?: number; // Time spent in milliseconds
  version?: string;
  labels?: {
    imageLabel?: string;
    label1?: string;
    label2?: string;
  };
}

/**
 * Format form data into the API submission structure
 */
export function formatFormResponse(options: ResponseFormatterOptions): FormSubmissionResponse {
  const {
    formId,
    formConfig,
    formData,
    timeSpent = 0,
    version = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14),
    labels = {
      imageLabel: "no_res_!@#$%",
      label1: "no_res_!@#$%",
      label2: "no_res_!@#$%",
    },
  } = options;

  // Generate UUID for this submission
  const submissionUUID = uuidv4();

  // Generate end date in the format: "YYYY-MM-DD HH:MM:SS"
  const endDate = formatDateTime(new Date());

  // Generate response flag (timestamp-based identifier)
  const responseFlag = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(2, 13); // Format: YYMMDDHHMM

  // Transform form data into question responses
  const questions = formatQuestions(formConfig, formData);

  return {
    response_data: {
      UUID: submissionUUID,
      end_date: endDate,
      formID: formId,
      geofence: "",
      gis: false,
      gis_data: "",
      isAuto: false,
      label: {
        imageLabel: labels.imageLabel || "no_res_!@#$%",
        label1: labels.label1 || "no_res_!@#$%",
        label2: labels.label2 || "no_res_!@#$%",
      },
      nth: false,
      original_gis_data: "",
      profiled: false,
      qrCode: {},
      questions,
      responseFlag,
      source_data: false,
      sth: false,
      time_spent: timeSpent.toString(),
      version,
    },
    survey_id: formId,
  };
}

/**
 * Transform form data into question response format
 */
function formatQuestions(
  formConfig: FormConfig,
  formData: Record<string, unknown>
): QuestionResponse[] {
  const questions: QuestionResponse[] = [];

  // Get all questions from either pages or flat questions array
  const allQuestions = formConfig.pages
    ? formConfig.pages.flatMap((page) => page.questions)
    : formConfig.questions;

  for (const question of allQuestions) {
    const value = formData[question.id] || formData[question.name];

    // Skip if no value provided (unless it's a required field)
    if (value === undefined || value === null || value === "") {
      if (question.required) {
        // Include empty required fields
        questions.push({
          id: question.id,
          type: mapFieldTypeToApiType(question.type),
        });
      }
      continue;
    }

    const response = formatQuestionResponse(question, value);
    questions.push(response);
  }

  return questions;
}

/**
 * Format individual question response based on field type
 */
function formatQuestionResponse(
  question: any,
  value: unknown
): QuestionResponse {
  const baseResponse: QuestionResponse = {
    id: question.id,
    type: mapFieldTypeToApiType(question.type),
  };

  switch (question.type) {
    case "qrcode":
      return {
        ...baseResponse,
        value: value as string,
        scanner_type: "QR_CODE",
      };

    case "tel":
      return {
        ...baseResponse,
        value: value as string,
        verified: false,
      };

    case "select":
      return formatSelectResponse(baseResponse, question, value);

    case "multiselect":
    case "checkbox-group":
      return formatMultiSelectResponse(baseResponse, question, value);

    case "location":
      return formatLocationResponse(baseResponse, value);

    case "polygon":
      return formatPolygonResponse(baseResponse, value);

    case "date":
      return {
        ...baseResponse,
        value: formatDateValue(value),
      };

    case "signature":
      return {
        ...baseResponse,
        value: value as string, // Should be file path or URL
      };

    case "file":
      return {
        ...baseResponse,
        value: value as string, // Should be file path or URL
      };

    case "number":
      return {
        ...baseResponse,
        value: value?.toString() || "0",
      };

    default:
      // text, email, url, textarea, password, etc.
      return {
        ...baseResponse,
        value: value as string,
      };
  }
}

/**
 * Format select/single-select response
 */
function formatSelectResponse(
  baseResponse: QuestionResponse,
  question: any,
  value: unknown
): QuestionResponse {
  const selectedOption = question.options?.find(
    (opt: any) => opt.value === value || opt.label === value
  );

  const displayValue = selectedOption?.label || (value as string);
  const keyValue = selectedOption?.value || (value as string);

  return {
    ...baseResponse,
    value: displayValue,
    valueProps: {
      isOther: false,
      key: keyValue,
      keyword_label: question.name || "",
      level: 0,
      uuid: `${String(displayValue).toLowerCase().replaceAll(/\s+/g, "-")}-${question.id}`,
      value: displayValue,
    },
  };
}

/**
 * Format multi-select/checkbox-group response
 */
function formatMultiSelectResponse(
  baseResponse: QuestionResponse,
  question: any,
  value: unknown
): QuestionResponse {
  const selectedValues = Array.isArray(value) ? value : [value];

  const valueProps = selectedValues
    .map((val) => {
      const option = question.options?.find(
        (opt: any) => opt.value === val || opt.label === val
      );
      const displayValue = option?.label || val;
      const keyValue = option?.value || val;

      return {
        isOther: false,
        key: keyValue,
        keyword_label: question.name || "",
        level: 0,
        uuid: `${String(displayValue).toLowerCase().replaceAll(/\s+/g, "-")}-${question.id}`,
        value: displayValue,
      };
    })
    .filter(Boolean);

  const displayValues = selectedValues.map((val) => {
    const option = question.options?.find(
      (opt: any) => opt.value === val || opt.label === val
    );
    return option?.label || val;
  });

  return {
    ...baseResponse,
    value: valueProps.length > 0 ? valueProps[0].key : undefined,
    values: displayValues,
    valueProps,
  };
}

/**
 * Format location/GPS response
 */
function formatLocationResponse(
  baseResponse: QuestionResponse,
  value: unknown
): QuestionResponse {
  if (typeof value === "object" && value !== null) {
    const locationValue = value as {
      latitude?: number;
      longitude?: number;
      accuracy?: number;
    };

    return {
      ...baseResponse,
      value: JSON.stringify({
        lat: locationValue.latitude || 0,
        lng: locationValue.longitude || 0,
        accuracy: locationValue.accuracy || 0,
      }),
    };
  }

  return {
    ...baseResponse,
    value: value as string,
  };
}

/**
 * Format polygon response
 */
function formatPolygonResponse(
  baseResponse: QuestionResponse,
  value: unknown
): QuestionResponse {
  // If value is already a string, use it directly
  if (typeof value === "string") {
    return {
      ...baseResponse,
      value,
    };
  }

  // If value is an object, stringify it
  if (typeof value === "object" && value !== null) {
    return {
      ...baseResponse,
      value: JSON.stringify(value),
    };
  }

  return {
    ...baseResponse,
    value: value as string,
  };
}

/**
 * Format date value to YYYY-MM-DD format
 */
function formatDateValue(value: unknown): string {
  if (typeof value === "string") {
    // If already in correct format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    // Try to parse and reformat
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return "";
}

/**
 * Format datetime to "YYYY-MM-DD HH:MM:SS" format
 */
function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Map internal field types to API types
 */
function mapFieldTypeToApiType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    text: "text",
    email: "email",
    password: "password",
    number: "number",
    tel: "phone",
    url: "url",
    textarea: "textarea",
    select: "single-select",
    multiselect: "multi-select",
    radio: "radio",
    checkbox: "checkbox",
    "checkbox-group": "multi-select",
    date: "date",
    time: "time",
    "datetime-local": "datetime",
    file: "image",
    signature: "signature",
    location: "location",
    qrcode: "qrcode",
    polygon: "polygon",
  };

  return typeMap[fieldType] || fieldType;
}
