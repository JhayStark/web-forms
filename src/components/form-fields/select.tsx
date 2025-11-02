import type { Control, FieldPath, FieldValues } from "react-hook-form";
import ReactSelect, {
  type Props as ReactSelectProps,
  type GroupBase,
} from "react-select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  options: TOption[];
  isMulti?: IsMulti;
  isClearable?: boolean;
  isSearchable?: boolean;
  selectProps?: Omit<
    ReactSelectProps<TOption, IsMulti, Group>,
    "value" | "onChange" | "options" | "isMulti" | "isDisabled"
  >;
}

const SelectFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>
>({
  control,
  name,
  label,
  placeholder = "Select...",
  description,
  disabled = false,
  options,
  isMulti,
  isClearable = true,
  isSearchable = true,
  selectProps,
}: SelectFormFieldProps<TFieldValues, TName, TOption, IsMulti, Group>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <ReactSelect
              {...field}
              options={options}
              isMulti={isMulti}
              isDisabled={disabled}
              isClearable={isClearable}
              isSearchable={isSearchable}
              placeholder={placeholder}
              classNamePrefix="react-select"
              unstyled
              classNames={{
                control: () =>
                  "border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                placeholder: () => "text-muted-foreground",
                input: () => "text-foreground",
                valueContainer: () => "gap-1",
                singleValue: () => "text-foreground",
                multiValue: () => "bg-secondary rounded-sm px-1.5 py-0.5",
                multiValueLabel: () => "text-secondary-foreground text-sm",
                multiValueRemove: () =>
                  "text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground rounded-sm",
                indicatorsContainer: () => "gap-1",
                clearIndicator: () =>
                  "text-muted-foreground hover:text-foreground p-1",
                dropdownIndicator: () =>
                  "text-muted-foreground hover:text-foreground p-1",
                menu: () =>
                  "bg-popover border-input mt-2 rounded-md border shadow-md",
                menuList: () => "p-1",
                option: ({ isFocused, isSelected }) =>
                  `px-2 py-1.5 rounded-sm cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isFocused
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`,
                noOptionsMessage: () => "text-muted-foreground p-2 text-sm",
              }}
              {...selectProps}
              onChange={(newValue) => {
                if (isMulti) {
                  // For multi-select, extract array of values
                  const values = Array.isArray(newValue)
                    ? newValue.map(
                        (option) => (option as unknown as SelectOption).value
                      )
                    : [];
                  field.onChange(values);
                } else {
                  // For single select, extract the value or null
                  const value = newValue
                    ? (newValue as unknown as SelectOption).value
                    : null;
                  field.onChange(value);
                }
              }}
              value={
                isMulti
                  ? options.filter(
                      (option) =>
                        Array.isArray(field.value) &&
                        field.value.includes(
                          (option as unknown as SelectOption).value
                        )
                    )
                  : options.find(
                      (option) =>
                        (option as unknown as SelectOption).value ===
                        field.value
                    )
              }
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
export type { SelectOption };
