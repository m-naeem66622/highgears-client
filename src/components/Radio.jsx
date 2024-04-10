import React from "react";
import { CustomRadio } from "./CustomRadio";
import { RadioGroup } from "@nextui-org/react";
import { Controller } from "react-hook-form";

const Radio = ({
  name = "",
  placeholder = "",
  label = "",
  orientation = "horizontal",
  items = [],
  isRequired = false,
  defaultValue = false,
  className = "",
  classNames = {},
  control,
  rules,
  error = "",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <RadioGroup
          isRequired={isRequired}
          label={label}
          value={
            field.value === "true"
              ? true
              : field.value === "false"
              ? false
              : field.value
          }
          onValueChange={(value) => field.onChange(value)}
          orientation={orientation}
          defaultValue={defaultValue}
          isInvalid={error ? true : false}
          errorMessage={error}
          className={className}
        >
          {items.map((option, index) => (
            <CustomRadio
              {...field}
              key={index}
              value={option.value}
              label={option.label}
            >
              {option.label}
            </CustomRadio>
          ))}
        </RadioGroup>
      )}
    />
  );
};

export default Radio;
