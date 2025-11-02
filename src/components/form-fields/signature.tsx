import { useRef } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SignatureFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  disabled?: boolean;
  width?: number;
  height?: number;
}

const SignatureFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  disabled = false,
  width = 500,
  height = 200,
}: SignatureFormFieldProps<TFieldValues, TName>) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="space-y-2">
              <div
                className={cn(
                  "border-input rounded-md border bg-white shadow-xs overflow-hidden",
                  disabled && "opacity-50 pointer-events-none"
                )}
              >
                <SignatureCanvas
                  ref={sigCanvasRef}
                  canvasProps={{
                    width: width,
                    height: height,
                    className: "signature-canvas w-full",
                  }}
                  onEnd={() => {
                    if (sigCanvasRef.current) {
                      const dataUrl = sigCanvasRef.current.toDataURL();
                      field.onChange(dataUrl);
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => {
                    if (sigCanvasRef.current) {
                      sigCanvasRef.current.clear();
                      field.onChange("");
                    }
                  }}
                >
                  Clear
                </Button>
                {field.value && (
                  <span className="text-muted-foreground text-sm self-center">
                    Signature captured
                  </span>
                )}
              </div>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SignatureFormField;
