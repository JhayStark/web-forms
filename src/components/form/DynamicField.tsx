import type { Control, FieldValues } from "react-hook-form";
import type { FormQuestion } from "@/types/form.types";
import InputFormField from "../form-fields/input";
import SelectFormField from "../form-fields/select";
import TextareaFormField from "../form-fields/textarea";
import CheckboxFormField from "../form-fields/checkbox";
import CheckboxGroupFormField from "../form-fields/checkbox-group";
import RadioFormField from "../form-fields/radio";
import PhoneFormField from "../form-fields/phone";
import SignatureFormField from "../form-fields/signature";
import LocationFormField from "../form-fields/location";
import DateFormField from "../form-fields/date";
import FileFormField from "../form-fields/file";
import QRCodeFormField from "../form-fields/qrcode";

interface DynamicFieldProps<TFieldValues extends FieldValues = FieldValues> {
  question: FormQuestion;
  control: Control<TFieldValues>;
}

/**
 * Dynamic field component that renders the appropriate form field
 * based on the question type
 */
const DynamicField = <TFieldValues extends FieldValues = FieldValues>({
  question,
  control,
}: DynamicFieldProps<TFieldValues>) => {
  const commonProps = {
    control,
    name: question.name as never,
    label: question.label,
    placeholder: question.placeholder,
    description: question.description,
    disabled: question.disabled,
  };

  switch (question.type) {
    case "text":
    case "email":
    case "password":
    case "number":
    case "url":
    case "time":
    case "datetime-local":
      return <InputFormField {...commonProps} type={question.type} />;

    case "date":
      return <DateFormField {...commonProps} />;

    case "tel":
      return <PhoneFormField {...commonProps} />;

    case "textarea":
      return <TextareaFormField {...commonProps} />;

    case "select":
      return (
        <SelectFormField
          {...commonProps}
          options={question.options || []}
          isClearable={!question.required}
        />
      );

    case "multiselect":
      return (
        <SelectFormField
          {...commonProps}
          options={question.options || []}
          isMulti
          isClearable={!question.required}
        />
      );

    case "radio":
      return (
        <RadioFormField
          {...commonProps}
          options={
            question.options?.map((opt) => ({
              value: String(opt.value),
              label: opt.label,
            })) || []
          }
        />
      );

    case "checkbox":
      return <CheckboxFormField {...commonProps} />;

    case "checkbox-group":
      return (
        <CheckboxGroupFormField
          {...commonProps}
          options={question.options || []}
        />
      );

    case "signature":
      return <SignatureFormField {...commonProps} />;

    case "location":
      return <LocationFormField {...commonProps} showMap />;

    case "file":
      return <FileFormField {...commonProps} multiple={false} />;

    case "qrcode":
      return <QRCodeFormField {...commonProps} />;

    default:
      return (
        <div className="text-destructive text-sm">
          Unknown field type: {question.type}
        </div>
      );
  }
};

export default DynamicField;
