import { useEffect, useRef, useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CheckCircle2, X, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "../ui/button";

interface QRCodeFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

const QRCodeFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  disabled = false,
}: QRCodeFormFieldProps<TFieldValues, TName>) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const onChangeRef = useRef<((value: string) => void) | null>(null);
  const scannerElementId = `qr-reader-${String(name)}`;

  // Initialize scanner when isScanning becomes true
  useEffect(() => {
    if (!isScanning) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      disableFlip: false,
    };

    // Delay initialization to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const element = document.getElementById(scannerElementId);
      if (!element) {
        console.error("Scanner element not found:", scannerElementId);
        setIsScanning(false);
        return;
      }

      scannerRef.current = new Html5QrcodeScanner(
        scannerElementId,
        config,
        false // verbose
      );

      scannerRef.current.render(
        // Success callback
        (decodedText) => {
          console.log("QR Code scanned:", decodedText);

          // Clean up scanner
          if (scannerRef.current) {
            scannerRef.current.clear().catch((err) => {
              console.error("Failed to clear scanner:", err);
            });
            scannerRef.current = null;
          }

          setIsScanning(false);

          // Update form field using ref
          if (onChangeRef.current) {
            onChangeRef.current(decodedText);
          }
        },
        // Error callback
        (errorMessage) => {
          console.debug("QR scan error:", errorMessage);
        }
      );
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => {
          console.error("Failed to clear scanner:", err);
        });
        scannerRef.current = null;
      }
    };
  }, [isScanning, scannerElementId]);

  const startScanning = () => {
    setIsScanning(true);
  };

  const handleCancel = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((err) => {
        console.error("Failed to clear scanner:", err);
      });
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Store the onChange function in ref so scanner callback can access it
        onChangeRef.current = field.onChange;

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                {/* Show scan button when not scanning and no value */}
                {!isScanning && !field.value && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={disabled}
                    onClick={startScanning}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Scan QR Code
                  </Button>
                )}

                {/* Scanner Container */}
                {isScanning && (
                  <div className="space-y-3">
                    <div
                      id={scannerElementId}
                      className="rounded-md border overflow-hidden"
                    />
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {field.value && !isScanning && (
                  <div className="rounded-md border border-green-600 bg-green-50 p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-green-900 text-sm font-medium">
                          QR Code Scanned Successfully
                        </p>
                        <p className="text-green-800 text-xs mt-1 break-all">
                          {field.value as string}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => field.onChange("")}
                        disabled={disabled}
                        title="Clear and scan again"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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

export default QRCodeFormField;
