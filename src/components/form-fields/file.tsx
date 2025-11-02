import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

const FileFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  disabled = false,
  accept,
  maxSize = 10, // 10MB default
  multiple = false,
}: FileFormFieldProps<TFieldValues, TName>) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: unknown) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    // Validate file size
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }
    }

    // Convert to base64 or file objects
    const filePromises = Array.from(files).map((file) => {
      return new Promise<{ name: string; size: number; type: string; data: string }>(
        (resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              data: reader.result as string,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }
      );
    });

    Promise.all(filePromises)
      .then((filesData) => {
        onChange(multiple ? filesData : filesData[0]);
      })
      .catch(() => {
        setError("Failed to read file");
      });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const files = field.value;
        const fileArray = multiple
          ? (Array.isArray(files) ? files : [])
          : (files ? [files] : []);

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                <div
                  className={cn(
                    "border-input hover:border-ring border-2 border-dashed rounded-md p-6 transition-colors",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="file"
                    id={`file-${String(name)}`}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(e) => handleFileChange(e, field.onChange)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`file-${String(name)}`}
                    className={cn(
                      "flex flex-col items-center gap-2 cursor-pointer",
                      disabled && "cursor-not-allowed"
                    )}
                  >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {accept || "Any file type"} (Max {maxSize}MB)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Display uploaded files */}
                {fileArray.length > 0 && (
                  <div className="space-y-2">
                    {fileArray.map((file: { name: string; size: number; type: string }, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-input rounded-md border bg-muted/50 p-3"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={disabled}
                          onClick={() => {
                            if (multiple) {
                              const newFiles = fileArray.filter(
                                (_: unknown, i: number) => i !== index
                              );
                              field.onChange(newFiles.length > 0 ? newFiles : undefined);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FileFormField;
