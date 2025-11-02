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
import { MapPin, Loader2 } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface LocationFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  disabled?: boolean;
  showMap?: boolean;
}

const LocationFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  disabled = false,
  showMap = false,
}: LocationFormFieldProps<TFieldValues, TName>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = (onChange: (value: LocationData) => void) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        onChange(locationData);
        setLoading(false);
      },
      (err) => {
        let errorMessage = "Unable to retrieve location";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const location = field.value as LocationData | undefined;

        return (
          <FormItem className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled || loading}
                  onClick={() => getLocation(field.onChange)}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      {location ? "Update Location" : "Get Current Location"}
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-destructive/10 border-destructive text-destructive rounded-md border p-3 text-sm">
                    {error}
                  </div>
                )}

                {location && (
                  <div className="border-input rounded-md border bg-muted/50 p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground font-medium">
                          Latitude:
                        </span>
                        <p className="font-mono">
                          {location.latitude.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">
                          Longitude:
                        </span>
                        <p className="font-mono">
                          {location.longitude.toFixed(6)}
                        </p>
                      </div>
                      {location.accuracy && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground font-medium">
                            Accuracy:
                          </span>
                          <p className="font-mono">
                            ±{location.accuracy.toFixed(0)} meters
                          </p>
                        </div>
                      )}
                    </div>

                    {showMap && (
                      <div className="pt-2">
                        <a
                          href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" />
                          View on Google Maps
                        </a>
                      </div>
                    )}
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

export default LocationFormField;
export type { LocationData };
