import { Chip, Select as NextUI_Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";

const Select = ({
  name = "",
  placeholder = "",
  label = "",
  className = "",
  classNames = {},
  isRequired = false,
  selectionMode = "single",
  selectItems = [],
  control,
  rules,
  error,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <NextUI_Select
          {...field}
          className={`w-full ${className} justify-start`}
          classNames={{
            label: "text-base",
            input: "placeholder:text-[#ACACAA]",
            ...classNames,
          }}
          isRequired={isRequired}
          label={label}
          isInvalid={error ? true : false}
          errorMessage={error}
          selectionMode={selectionMode}
          onChange={(e) => field.onChange(e.target.value.split(","))}
          selectedKeys={field.value}
          isMultiline={selectionMode === "multiple" ? true : false}
          variant="bordered"
          radius="none"
          size="lg"
          labelPlacement="outside"
          placeholder={placeholder}
          disabledKeys={[""]}
          renderValue={(items) => {
            return selectionMode === "single" ? (
              items[0].textValue
            ) : (
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Chip className="bg-black text-white" key={item.key}>
                    {item.textValue}
                  </Chip>
                ))}
              </div>
            );
          }}
        >
          {selectItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </NextUI_Select>
      )}
    />
  );
};

export default Select;
