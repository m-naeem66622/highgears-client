import { Textarea as NextUI_Textarea } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";

const Textarea = ({
  name = "",
  placeholder = "",
  label = "",
  minRows = 3,
  isRequired = false,
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
      defaultValue=""
      render={({ field }) => (
        <NextUI_Textarea
          {...field}
          name={name}
          className={`w-full ${className}`}
          classNames={{
            label: "text-base",
            input: "placeholder:text-[#ACACAA]",
            ...classNames,
          }}
          type="text"
          minRows={minRows}
          maxRows={15}
          label={label}
          variant="bordered"
          isRequired={isRequired}
          isInvalid={error ? true : false}
          errorMessage={error}
          radius="none"
          size="lg"
          labelPlacement="outside"
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default Textarea;
