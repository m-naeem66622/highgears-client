import React, { useState } from "react";
import { Controller } from "react-hook-form";
import ReactCreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";

const CreatableSelect = ({
  name = "",
  placeholder = "Type something and press enter or tab...",
  label = "",
  className = "",
  classNames = {},
  isRequired = false,
  control,
  rules,
  error,
}) => {
  const animatedComponents = makeAnimated();
  const [inputValue, setInputValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const isRequiredStyle = isRequired
    ? `${
        error ? "text-danger" : ""
      } after:content-['*'] after:text-danger after:ml-0.5`
    : `${error ? "text-danger" : ""}`;

  let errorString = "";
  for (const key in error) {
    errorString += error[key].message + " ";
  }

  const handleKeyDown = (event, field) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        field.onChange([...field.value.map((items) => items), inputValue]);
        setInputValue("");
        event.preventDefault();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className={`flex flex-col w-full ${className}`}>
          <label className={isRequiredStyle}>{label}</label>
          <ReactCreatableSelect
            {...field}
            components={animatedComponents}
            inputValue={inputValue}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(newValue) => field.onChange(newValue)}
            onInputChange={(newValue) => setInputValue(newValue)}
            onKeyDown={(e) => handleKeyDown(e, field)}
            placeholder={placeholder}
            value={field.value.map((value) =>
              typeof value === "object" ? value : { label: value, value: value }
            )}
            styles={{
              control: (styles) => ({
                ...styles,
                backgroundColor: "transparent",
                color: "#a6adbb",
                borderColor: error ? "red" : "transparent",
                borderWidth: "2px",
                boxShadow: "none",
                ":hover": {
                  borderColor: error ? "red" : "blue",
                  boxShadow: "none",
                },
                minHeight: "48px",
                borderRadius: "0",
              }),
            }}
          />
          {error && (
            <div className="flex p-1 relative flex-col gap-1.5">
              <div className="text-tiny text-danger">{error}</div>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default CreatableSelect;
