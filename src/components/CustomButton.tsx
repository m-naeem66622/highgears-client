import { extendVariants, Button } from "@nextui-org/react";

export const CustomButton = extendVariants(Button, {
  variants: {
    // <- modify/add variants
    color: {
      dark: "text-white bg-black",
      danger: "text-white bg-red-500",
    },
    isDisabled: {
      true: "opacity-50 cursor-not-allowed text-gray-500 bg-gray-200",
    },
  },
  compoundVariants: [
    // <- modify/add compound variants
    {
      isDisabled: true,
      color: "dark",
      class: "bg-black/80 opacity-100",
    },
  ],
});
