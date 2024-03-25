import { Input as NextUI_Input } from "@nextui-org/react";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { EyeFilledIcon } from "../assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon";

const Input = (props) => {
  const {
    name = "",
    defaultValue = "",
    placeholder = "",
    label = "",
    type = "text",
    className = "",
    classNames = {},
    isRequired = false,
    control,
    rules,
    error = "",
    inputProps = {},
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <NextUI_Input
          {...inputProps}
          {...field}
          className={`w-full ${className}`}
          classNames={{ input: "placeholder:text-[#ACACAA]", ...classNames }}
          type={isVisible ? type : type === "password" ? "password" : type}
          isRequired={isRequired}
          label={label}
          defaultValue={defaultValue}
          isInvalid={error ? true : false}
          errorMessage={error}
          endContent={
            type === "password" && (
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            )
          }
          variant="bordered"
          radius="none"
          size="lg"
          labelPlacement="outside"
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default Input;
