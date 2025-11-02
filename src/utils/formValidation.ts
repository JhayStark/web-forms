import { z } from "zod";
import type { FormQuestion, ValidationRule } from "@/types/form.types";

/**
 * Build a Zod schema for a single field based on its validation rules
 */
export function buildFieldSchema(question: FormQuestion): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  // Base schema based on field type
  switch (question.type) {
    case "email":
      schema = z.string().email("Invalid email address");
      break;
    case "url":
      schema = z.string().url("Invalid URL");
      break;
    case "number":
      schema = z.coerce.number();
      break;
    case "checkbox":
      schema = z.boolean();
      break;
    case "multiselect":
    case "checkbox-group":
      schema = z.array(z.union([z.string(), z.number()]));
      break;
    case "date":
    case "time":
    case "datetime-local":
      schema = z.string();
      break;
    case "file":
      // File can be single object or array of objects
      schema = z.union([
        z.object({
          name: z.string(),
          size: z.number(),
          type: z.string(),
          data: z.string(),
        }),
        z.array(z.object({
          name: z.string(),
          size: z.number(),
          type: z.string(),
          data: z.string(),
        })),
      ]);
      break;
    case "signature":
      // Signature is a base64 data URL string
      schema = z.string();
      break;
    case "location":
      // Location is an object with latitude and longitude
      schema = z.object({
        latitude: z.number(),
        longitude: z.number(),
        accuracy: z.number().optional(),
        timestamp: z.number(),
      });
      break;
    case "qrcode":
      // QR code is a string (scanned data)
      schema = z.string();
      break;
    default:
      schema = z.string();
  }

  // Apply validation rules
  if (question.validation) {
    for (const rule of question.validation) {
      schema = applyValidationRule(schema, rule, question.type);
    }
  }

  // Handle required field
  if (question.required) {
    if (question.type === "checkbox") {
      schema = z.boolean().refine((val) => val === true, {
        message: "This field is required",
      });
    } else if (question.type === "multiselect" || question.type === "checkbox-group") {
      schema = (schema as z.ZodArray<z.ZodTypeAny>).min(1, "Please select at least one option");
    } else {
      // For string-based fields
      if (schema instanceof z.ZodString) {
        schema = schema.min(1, "This field is required");
      }
    }
  } else {
    // Make field optional if not required
    if (question.type === "checkbox") {
      schema = z.boolean().optional();
    } else if (question.type === "multiselect" || question.type === "checkbox-group") {
      schema = z.array(z.union([z.string(), z.number()])).optional();
    } else {
      schema = schema.optional();
    }
  }

  return schema;
}

/**
 * Apply a single validation rule to a schema
 */
function applyValidationRule(
  schema: z.ZodTypeAny,
  rule: ValidationRule,
  fieldType: string
): z.ZodTypeAny {
  switch (rule.type) {
    case "required":
      // Handled separately in buildFieldSchema
      return schema;

    case "min":
      if (schema instanceof z.ZodNumber) {
        return schema.min(Number(rule.value), rule.message);
      }
      return schema;

    case "max":
      if (schema instanceof z.ZodNumber) {
        return schema.max(Number(rule.value), rule.message);
      }
      return schema;

    case "minLength":
      if (schema instanceof z.ZodString) {
        return schema.min(Number(rule.value), rule.message);
      }
      return schema;

    case "maxLength":
      if (schema instanceof z.ZodString) {
        return schema.max(Number(rule.value), rule.message);
      }
      return schema;

    case "pattern":
      if (schema instanceof z.ZodString && rule.value) {
        return schema.regex(new RegExp(String(rule.value)), rule.message);
      }
      return schema;

    case "email":
      if (schema instanceof z.ZodString) {
        return schema.email(rule.message);
      }
      return schema;

    case "url":
      if (schema instanceof z.ZodString) {
        return schema.url(rule.message);
      }
      return schema;

    default:
      return schema;
  }
}

/**
 * Build a complete Zod schema for the entire form
 */
export function buildFormSchema(questions: FormQuestion[]): z.ZodObject<z.ZodRawShape> {
  const shape: z.ZodRawShape = {};

  for (const question of questions) {
    shape[question.name] = buildFieldSchema(question);
  }

  return z.object(shape);
}

/**
 * Get default values for the form
 */
export function getFormDefaultValues(questions: FormQuestion[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const question of questions) {
    if (question.defaultValue !== undefined) {
      defaults[question.name] = question.defaultValue;
    } else {
      // Set sensible defaults based on field type
      switch (question.type) {
        case "checkbox":
          defaults[question.name] = false;
          break;
        case "multiselect":
        case "checkbox-group":
          defaults[question.name] = [];
          break;
        case "number":
          defaults[question.name] = "";
          break;
        case "signature":
          defaults[question.name] = "";
          break;
        case "location":
          defaults[question.name] = undefined;
          break;
        case "file":
          defaults[question.name] = undefined;
          break;
        default:
          defaults[question.name] = "";
      }
    }
  }

  return defaults;
}
