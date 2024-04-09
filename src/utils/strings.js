export function toKebabCase(str = "") {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export function toTitleCase(str = "") {
  return str
    .split(str.includes("-") ? "-" : " ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export function formatPhoneNumber(phoneNumber) {
  let concatenatedNumber = phoneNumber.dialCode + phoneNumber.number;

  let count = 0;
  const formattedNumber = phoneNumber.format
    .split("")
    .map((char) => {
      if (char === ".") {
        return concatenatedNumber[count++];
      }
      return char;
    })
    .join("");

  return formattedNumber;
}
