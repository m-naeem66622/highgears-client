const Validate = {
  password: {
    minLength: (value) => {
      if (value.length < 8) {
        return "Password must be at least 8 characters long";
      }
      return true;
    },
    uppercase: (value) => {
      if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter";
      }
      return true;
    },
    lowercase: (value) => {
      if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter";
      }
      return true;
    },
    number: (value) => {
      if (!/\d/.test(value)) {
        return "Password must contain at least one number";
      }
      return true;
    },
  },
  email: {
    validFormat: (value) => {
      const regex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
      if (!regex.test(value)) {
        return "Invalid email format";
      }
      return true;
    },
  },
  phoneNumber: {
    countryCode: (value) => {
      if (!value.countryCode) {
        return "Country code is required";
      }
      return true;
    },
    dialCode: (value) => {
      if (!value.dialCode) {
        return "Dial code is required";
      }
      if (typeof value === "string") {
        return "Dial code must be string";
      }
      return true;
    },
    number: (value) => {
      if (!value.number) {
        return "Phone number is required";
      }
      if (typeof value === "string") {
        return "Phone number must be string";
      }
      return true;
    },
    format: (value) => {
      if (!value.format) {
        return "Phone number format is required";
      }
      return true;
    },
  },
};

export default Validate;
