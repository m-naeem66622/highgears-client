import React, { useRef } from "react";
import { Controller, useController } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

const InputPhoneNumber = (props) => {
  const {
    name = "phoneNumber",
    label = "Phone Number",
    defaultValue = "",
    countryCode,
    setValue,
    control,
    isRequired = false,
    rules = {},
    error,
  } = props;

  const isRequiredStyle = isRequired
    ? "after:content-['*'] after:text-danger after:ml-0.5"
    : "";

  let errorString = "";
  for (const key in error) {
    errorString += error[key].message + " ";
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      // rules={rules}
      render={({ field }) => (
        <div className="flex flex-col w-full">
          <label className={isRequiredStyle}>{label}</label>
          <PhoneInput
            {...field}
            onChange={(value, country, e, formattedValue) =>
              setValue("phoneNumber", {
                countryCode: country.countryCode,
                dialCode: country.dialCode,
                number: value.replace(country.dialCode, ""),
                format: country.format,
                value,
              })
            }
            value={field.value.value}
            enableSearch={true}
            inputProps={{ name }}
            inputStyle={{
              fontSize: "1rem",
              width: "100%",
              height: "3rem",
              paddingLeft: "55px",
              borderRadius: "0",
            }}
            buttonStyle={{ borderRadius: "0" }}
            country={countryCode?.toLowerCase()}
            searchClass=""
            inputClass="placeholder:text-[#ACACAA]"
            containerClass="bg-transparent h-12 z-30"
            buttonClass="bg-blue-700"
          />
          <p className="text-danger-500">{errorString}</p>
        </div>
      )}
    />
  );
};

export default InputPhoneNumber;
