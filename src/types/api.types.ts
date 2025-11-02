/**
 * Types matching your actual API response format
 */

export interface ApiQuestionOption {
  key: string;
  value: string;
}

export interface ApiQuestionValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface ApiQuestionSource {
  editable: boolean;
}

export interface ApiQuestion {
  id: string;
  type: string; // "text", "phone", "single-select", "multi-select", "textarea", etc.
  index: number;
  title: string;
  source: ApiQuestionSource;
  validation?: ApiQuestionValidation;
  countryCode?: string;
  options?: ApiQuestionOption[];
  placeholder?: string;
  description?: string;
  defaultValue?: string | number | boolean | string[];
  dependsOn?: {
    field: string;
    value: string | number | boolean;
  };
}

export interface ApiFormConfig {
  id: string;
  title: string;
  description?: string;
  questions: ApiQuestion[];
  submitUrl?: string;
}
