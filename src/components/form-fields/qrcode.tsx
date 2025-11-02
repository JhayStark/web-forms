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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Camera, X, CheckCircle2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Html5Qrcode } from "html5-qrcode";

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
  placeholder = "Scan QR code or enter manually",
  description,
  disabled = false,
}: QRCodeFormFieldProps<TFieldValues, TName>) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = `qr-reader-${String(name)}`;

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const startScanning = async (onChange: (value: unknown) => void) => {
    setError(null);

    try {
      // Initialize scanner
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerElementId);
      }

      // Start scanning
      await scannerRef.current.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning box size
        },
        (decodedText) => {
          // Success callback
          onChange(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Error callback (called very frequently, so we don't show these)
          console.debug("QR scan error:", errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start camera";
      setError(errorMsg);
      setIsScanning(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="space-y-3">
              {/* Show input only when not scanning */}
              {!isScanning && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      {...field}
                      value={(field.value as string) || ""}
                      placeholder={placeholder}
                      disabled={disabled}
                      className={cn(field.value && "pr-10")}
                    />
                    {field.value && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    onClick={() => startScanning(field.onChange)}
                    title="Scan QR Code"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* QR Scanner */}
              {isScanning && (
                <div className="space-y-3">
                  <div
                    className={cn(
                      "border-input rounded-md border overflow-hidden",
                      "bg-black"
                    )}
                  >
                    <div id={scannerElementId} className="w-full" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <QrCode className="h-4 w-4" />
                      <span>Position QR code within the frame</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={stopScanning}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-md border border-destructive bg-destructive/10 p-3">
                  <p className="text-destructive text-sm">{error}</p>
                  <p className="text-destructive/80 text-xs mt-1">
                    Make sure you've granted camera permissions in your browser.
                  </p>
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
                      title="Clear"
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
      )}
    />
  );
};

export default QRCodeFormField;
