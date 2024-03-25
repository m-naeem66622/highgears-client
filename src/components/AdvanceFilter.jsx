import {
  Button,
  CheckboxGroup,
  Select,
  SelectItem,
  Slider,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CustomCheckbox } from "./CustomCheckbox";
import { colors, priceRange, sizes } from "../staticData";
import { CustomButton } from "./CustomButton";

const AdvanceFilter = ({ filters, setFilters, handleOnClick }) => {
  const onChangeHandle = (name, value) => {
    let modifiedValue = value;
    if (name === "colors") {
      modifiedValue = Array.from(value);
    }
    setFilters({ ...filters, [name]: modifiedValue });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Advanced Filter</h2>
      <div className="flex justify-between">
        <div className="flex items-start gap-x-6 gap-y-4">
          <div className="flex flex-col gap-2 w-48 h-full max-w-md items-start justify-center">
            <Slider
              name="priceRange"
              label="Price Range"
              formatOptions={{ style: "currency", currency: "USD" }}
              classNames={{ value: "hidden" }}
              size="sm"
              step={1}
              minValue={priceRange[0]}
              maxValue={priceRange[1]}
              showTooltip
              defaultValue={filters.priceRange}
              onChangeEnd={(value) => onChangeHandle("priceRange", value)}
              className="max-w-md"
            />
            <p className="text-default-500 font-medium text-small">
              {Array.isArray(filters.priceRange) &&
                filters.priceRange.map((b) => `$${b}`).join(" - ")}
            </p>
          </div>
          <div>
            <CheckboxGroup
              className="gap-1"
              label="Select sizes"
              orientation="horizontal"
              value={filters.sizes}
              onChange={(values) => onChangeHandle("sizes", values)}
            >
              {sizes.map((size) => (
                <CustomCheckbox key={size.value} value={size.value}>
                  {size.label}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
          <div>
            <Select
              name="colors"
              placeholder="Select"
              label="Select Colors"
              selectionMode="multiple"
              className="w-60"
              labelPlacement="outside"
              onSelectionChange={(key) => onChangeHandle("colors", key)}
            >
              {colors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  {color.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <CustomButton color="dark" radius="none" onClick={handleOnClick}>
          Apply Filters
        </CustomButton>
      </div>
    </div>
  );
};

export default AdvanceFilter;
