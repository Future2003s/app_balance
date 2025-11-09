"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { VietnameseDatePicker } from "./VietnameseDatePicker";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, className, value, onChange, disabled, ...props }, ref) => {
    const handleChange = (dateValue: string) => {
      if (onChange) {
        // Crear un evento sintético para mantener compatibilidad
        const syntheticEvent = {
          target: { value: dateValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <VietnameseDatePicker
        value={value as string}
        onChange={handleChange}
        label={label}
        error={error}
        className={className}
        disabled={disabled}
        placeholder="dd/mm/yyyy"
      />
    );
  }
);

DateInput.displayName = "DateInput";

