export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "checkbox-group"
  | "date"
  | "time"
  | "datetime-local"
  | "file"
  | "signature"
  | "location"
  | "qrcode";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ValidationRule {
  type: "required" | "min" | "max" | "minLength" | "maxLength" | "pattern" | "email" | "url";
  value?: string | number;
  message: string;
}

export interface FormQuestion {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  defaultValue?: string | number | boolean | string[];
  options?: SelectOption[];
  validation?: ValidationRule[];
  disabled?: boolean;
  required?: boolean;
  dependsOn?: {
    field: string;
    value: string | number | boolean;
  };
}

export interface FormPage {
  name: string;
  questions: FormQuestion[];
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  pages?: FormPage[]; // Optional: if present, use pages instead of flat questions
  submitUrl?: string;
}

export interface FormSubmissionData {
  formId: string;
  responses: Record<string, unknown>;
  submittedAt: string;
}
