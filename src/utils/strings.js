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
  let formattedNumber = phoneNumber.format;
  formattedNumber = formattedNumber.replace("..", phoneNumber.dialCode);
  let numberParts = phoneNumber.number.match(/.{1,3}/g); // split number into groups of 3
  numberParts.forEach((part) => {
    formattedNumber = formattedNumber.replace("...", part);
  });
  return formattedNumber;
}
