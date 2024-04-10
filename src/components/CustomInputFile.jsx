import { forwardRef } from "react";
import { useInput } from "@nextui-org/react";

const CustomInputFile = forwardRef((props, ref) => {
  const { register, rules, multiple = false, ...restProps } = props;
  const {
    Component,
    domRef,
    label,
    errorMessage,
    getBaseProps,
    getLabelProps,
    getMainWrapperProps,
    getInputWrapperProps,
    getHelperWrapperProps,
    getErrorMessageProps,
    shouldLabelBeOutside,
  } = useInput({
    ...restProps,
    ref,
    variant: "bordered",
    radius: "none",
    size: "lg",
    labelPlacement: "outside",
  });

  const labelContent = <label {...getLabelProps()}>{label}</label>;

  return (
    <Component {...getBaseProps()}>
      <div {...getMainWrapperProps()}>
        <div
          {...getInputWrapperProps()}
          role="button"
          onClick={() => {
            domRef.current?.focus();
          }}
        >
          {shouldLabelBeOutside ? labelContent : null}
          <input
            className="focus:outline-none focus:ring-0"
            type="file"
            {...register(restProps.name, rules)}
            accept="image/png, image/jpg, image/jpeg"
            multiple={multiple}
          />
        </div>
        <div {...getHelperWrapperProps()}>
          {errorMessage && (
            <div {...getErrorMessageProps()}>{errorMessage}</div>
          )}
        </div>
      </div>
    </Component>
  );
});

export default CustomInputFile;
