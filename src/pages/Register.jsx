import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Validate from "../utils/validators";
import axios from "axios";
import { notify } from "../utils/notify";
import { toTitleCase } from "../utils/strings";
import { setCredentials } from "../slices/authSlice";
import { AUTH_URL } from "../constants";
import Input from "../components/Input";
import Select from "../components/Select";
import { genders } from "../staticData";
import { Country, State, City } from "country-state-city";
import AutoComplete from "../components/AutoComplete";
import InputPhoneNumber from "../components/InputPhoneNumber";
import { CustomButton } from "../components/CustomButton";

function Register() {
  document.title = "Register | Grand Online Store";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);
  const [ipData, setIpData] = useState({ countryCode: "PK" });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      address: {
        country: "",
        state: "",
        city: "",
        street: "",
        zipCode: "",
      },
      phoneNumber: {
        countryCode: "",
        dialCode: "",
        number: "",
        format: "",
        value: "",
      },
      password: "",
    },
  });

  watch("address.country");
  watch("address.state");

  const getFormattedData = (data) => {
    const formData = {
      ...data,
      address: {
        ...data.address,
        country: Country.getCountryByCode(data.address.country).name,
        state: State.getStateByCodeAndCountry(
          data.address.state,
          data.address.country
        ).name,
        city: data.address.city.split("-")[0],
      },
      phoneNumber: { ...data.phoneNumber },
    };
    delete formData.phoneNumber.value;

    return formData;
  };

  const onSubmitHandle = async (data) => {
    setRolling(true);
    try {
      const response = await axios.post(
        `${AUTH_URL}/register`,
        getFormattedData(data)
      );
      dispatch(setCredentials(response.data));
      navigate("/");
      notify("success", "You have successfully signed in!");
    } catch (error) {
      console.log("Error while registering user:", error.response?.data);
      let message = "Oops! Something went wrong";

      // Check if the error is not from the server
      if (!error.response) message = error.message;
      else if (error.response.status !== 400)
        message = toTitleCase(error.response?.data.error.message);

      if (error.response?.status === 400) {
        for (const key in error.response?.data.errors) {
          const value = error.response?.data.errors[key];
          setError(key, { type: "manual", message: value });
        }
        message = error.response?.data.message;
      }

      notify("error", message);
    }
    setRolling(false);
  };

  useEffect(() => {
    axios.get("https://freeipapi.com/api/json").then((res) => {
      setIpData(res.data);
    });
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground-600">
          Create your free account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-screen-sm">
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmitHandle)}
        >
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Input
              name="firstName"
              placeholder="John"
              label="First Name"
              isRequired
              control={control}
              rules={{ required: "First name is required" }}
              error={errors.firstName?.message}
            />
            <Input
              name="lastName"
              placeholder="Doe"
              label="Last Name"
              isRequired
              control={control}
              rules={{ required: "Last name is required" }}
              error={errors.lastName?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Input
              name="email"
              placeholder="example@email.com"
              label="Email"
              type="email"
              isRequired
              control={control}
              rules={{
                required: "Email is required",
                validate: Validate.email,
              }}
              error={errors.email?.message}
            />
            <Select
              name="gender"
              placeholder="Select Gender"
              label="Gender"
              isRequired
              selectItems={genders}
              control={control}
              error={errors.gender?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <AutoComplete
              name="address.country"
              placeholder="Select Country"
              label="Country"
              isRequired
              autoCompleteItems={[
                { label: "Select", value: "" },
                ...Country.getAllCountries().map((c) => ({
                  label: c.name,
                  value: c.isoCode,
                })),
              ]}
              setValue={setValue}
              control={control}
              error={errors.address?.country?.message}
            />
            <AutoComplete
              name="address.state"
              placeholder="Select State"
              label="State"
              isRequired
              autoCompleteItems={[
                { label: "Select", value: "" },
                ...State.getStatesOfCountry(getValues("address.country")).map(
                  (s) => ({
                    label: s.name,
                    value: s.isoCode,
                  })
                ),
              ]}
              setValue={setValue}
              control={control}
              error={errors.address?.state?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <AutoComplete
              name="address.city"
              placeholder="Select City"
              label="City"
              isRequired
              autoCompleteItems={[
                { label: "Select", value: "" },
                ...City.getCitiesOfState(
                  getValues("address.country"),
                  getValues("address.state")
                ).map((c) => ({
                  label: c.name,
                  value: `${c.name}-${c.countryCode}-${c.stateCode}`,
                })),
              ]}
              setValue={setValue}
              control={control}
              error={errors.address?.city?.message}
            />
            <Input
              name="address.street"
              placeholder="Street ABC"
              label="Street"
              control={control}
              error={errors.address?.street?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Input
              name="address.zipCode"
              placeholder="52120"
              label="Zip Code"
              defaultValue={ipData.zipCode}
              isRequired
              control={control}
              rules={{ required: "Zip code name is required" }}
              error={errors.address?.zipCode?.message}
            />
            <InputPhoneNumber
              isRequired
              control={control}
              countryCode={ipData.countryCode}
              setValue={setValue}
              rules={{
                required: "Phone number is required",
                // validate: Validate.phoneNumber,
              }}
              error={errors.phoneNumber}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Input
              name="password"
              placeholder="Enter password"
              label="Password"
              type="password"
              isRequired
              control={control}
              rules={{
                required: "Password is required",
                //   validate: Validate.password,
              }}
              error={errors.password?.message}
            />
          </div>

          <CustomButton
            color="dark"
            radius="none"
            type="submit"
            className="w-full"
            isLoading={rolling}
          >
            Register
          </CustomButton>
        </form>

        <p className="mt-10 text-center text-sm text-base-content">
          Already a member?
          <Link to="/login" className="font-semibold leading-6 ml-1">
            Login to your account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
