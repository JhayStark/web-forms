import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import PolygonMap, { type Coordinate } from "../map/PolygonMap";

interface PolygonFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  disabled?: boolean;
  apiKey?: string;
  center?: Coordinate;
  zoom?: number;
}

const PolygonFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  disabled = false,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  center,
  zoom = 8,
}: PolygonFormFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div>
              {apiKey ? (
                <PolygonMap
                  coordinates={
                    Array.isArray(field.value) ? field.value : []
                  }
                  onChange={field.onChange}
                  center={center}
                  zoom={zoom}
                  apiKey={apiKey}
                  editable={!disabled}
                />
              ) : (
                <div className="rounded-md border border-destructive bg-destructive/10 p-4">
                  <p className="text-destructive text-sm font-medium">
                    Google Maps API Key Missing
                  </p>
                  <p className="text-destructive/80 text-xs mt-1">
                    Please set VITE_GOOGLE_MAPS_API_KEY in your .env file
                  </p>
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

export default PolygonFormField;
