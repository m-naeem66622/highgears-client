import {
  Autocomplete as NextUI_Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";

const AutoComplete = (props) => {
  const {
    name = "",
    placeholder = "",
    label = "",
    className = "",
    classNames = {},
    isRequired = false,
    defaultItems = [{ value: "", label: "Select" }],
    autoCompleteItems = [{ value: "", label: "Select" }],
    control,
    setValue,
    rules,
    error,
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={rules}
      render={({ field }) => (
        <NextUI_Autocomplete
          {...field}
          className={`w-full ${className}`}
          classNames={{ input: "placeholder:text-[#ACACAA]", ...classNames }}
          isRequired={isRequired}
          label={label}
          isInvalid={error ? true : false}
          errorMessage={error}
          variant="bordered"
          radius="none"
          size="lg"
          labelPlacement="outside"
          placeholder={placeholder}
          selectedKey={field.value}
          disabledKeys={[""]}
          onSelectionChange={(value) => setValue(name, value)}
          defaultItems={defaultItems}
        >
          {autoCompleteItems.map((role) => (
            <AutocompleteItem key={role.value} value={role.value}>
              {role.label}
            </AutocompleteItem>
          ))}
        </NextUI_Autocomplete>
      )}
    />
  );
};

export default AutoComplete;
