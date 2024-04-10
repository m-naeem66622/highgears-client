import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatPhoneNumber, toTitleCase } from "../../utils/strings";
import Text from "../Text";
import { CustomButton } from "../CustomButton";
import { Chip, Switch, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Input from "../Input";
import Select from "../Select";
import { genders } from "../../staticData";
import { Country, State, City } from "country-state-city";
import AutoComplete from "../AutoComplete";
import InputPhoneNumber from "../InputPhoneNumber";
import { notify } from "../../utils/notify";
import { logout, setCredentials } from "../../slices/authSlice";
import axios from "axios";
import { USER_URL } from "../../constants";
import ConfirmationModal from "../ConfirmationModal";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [mode, setMode] = useState("read");
  const [changePassword, setChangePassword] = useState(false);
  const [rolling, setRolling] = useState({ for: "", value: false });

  const {
    handleSubmit,
    unregister,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
    setError,
    reset,
  } = useForm({
    defaultValues: {
      ...userInfo,
      address: (() => {
        const obj = {};
        const country = Country.getAllCountries().find(
          (c) => c.name === userInfo.address.country
        );
        obj.country = country.isoCode;
        const state = State.getStatesOfCountry(country.isoCode).find(
          (s) => s.name === userInfo.address.state
        );
        obj.state = state.isoCode;
        const city = `${userInfo.address.city}-${country.isoCode}-${state.isoCode}`;
        obj.city = city;
        obj.street = userInfo.address.street;
        obj.zipCode = userInfo.address.zipCode;
        return obj;
      })(),
      phoneNumber: {
        ...userInfo.phoneNumber,
        value: userInfo.phoneNumber.dialCode + userInfo.phoneNumber.number,
      },
    },
  });

  const onChangePasswordHandle = () => {
    setChangePassword((prev) => {
      if (!prev === false) {
        unregister(["oldPassword", "password"]);
      }
      return !prev;
    });
  };

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
    delete formData.createdAt;
    delete formData.email;
    delete formData.isAdmin;
    delete formData.updatedAt;
    delete formData.__v;
    delete formData._id;

    return formData;
  };

  const onSubmitHandle = async (data) => {
    setRolling({ for: "update", value: true });
    try {
      const response = await axios.patch(
        `${USER_URL}/profile`,
        getFormattedData(data),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      dispatch(setCredentials(response.data));
      setMode("read");
      notify("success", response.data.message);
    } catch (error) {
      console.log("Error:", error.response);
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
      }

      notify("error", message);
    }
    setRolling({ for: "", value: false });
  };

  const handleDeleteAccount = async () => {
    setRolling({ for: "delete", value: true });
    try {
      const response = await axios.delete(`${USER_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      notify("success", response.data.message);
      navigate("/");
      dispatch(logout());
    } catch (error) {
      console.log("Error:", error.response);
      let message = "Oops! Something went wrong";

      // Check if the error is not from the server
      if (!error.response) message = error.message;
      else message = error.response.data.message;

      notify("error", message);
    }
    setRolling({ for: "", value: false });
  };

  useEffect(() => {
    if (mode === "read") reset();
  }, [mode]);

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => handleDeleteAccount()}
        rolling={rolling.for === "delete" && rolling.value}
        title="Delete Confirmation"
      >
        <Text as="p" className="py-4 sm:text-lg">
          Are you sure you want to delete an account?
        </Text>
      </ConfirmationModal>
      <div className="flex items-center justify-start gap-x-3 mb-6">
        <Text as="h4">Personal Information</Text>
        <Chip radius="none" color="success" className="">
          {userInfo.isAdmin ? "Admin" : "User"}
        </Chip>
      </div>
      {mode === "edit" ? (
        <>
          <form
            className="flex flex-col gap-y-6"
            onSubmit={handleSubmit(onSubmitHandle)}
          >
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
              <Input
                name="firstName"
                placeholder="John"
                label="First Name"
                defaultValue={userInfo.firstName}
                isRequired
                control={control}
                rules={{ required: "First name is required" }}
                error={errors.firstName?.message}
              />
              <Input
                name="lastName"
                placeholder="Doe"
                label="Last Name"
                defaultValue={userInfo.lastName}
                isRequired
                control={control}
                rules={{ required: "Last name is required" }}
                error={errors.lastName?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
              <Select
                name="gender"
                placeholder="Select Gender"
                label="Gender"
                isRequired
                selectItems={genders}
                control={control}
                error={errors.gender?.message}
              />
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
            </div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
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
                  ).map((c) => {
                    return {
                      label: c.name,
                      value: `${c.name}-${c.countryCode}-${c.stateCode}`,
                    };
                  }),
                ]}
                setValue={setValue}
                control={control}
                error={errors.address?.city?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
              <Input
                name="address.street"
                placeholder="Street ABC"
                label="Street"
                defaultValue={userInfo.address.street}
                control={control}
                error={errors.address?.street?.message}
              />
              <Input
                name="address.zipCode"
                placeholder="52120"
                label="Zip Code"
                defaultValue={userInfo.address.zipCode}
                isRequired
                control={control}
                rules={{ required: "Zip code name is required" }}
                error={errors.address?.zipCode?.message}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-6">
              <InputPhoneNumber
                isRequired
                control={control}
                countryCode={userInfo.phoneNumber.countryCode}
                setValue={setValue}
                rules={{
                  required: "Phone number is required",
                  // validate: Validate.phoneNumber,
                }}
                error={errors.phoneNumber}
              />
            </div>
            <Switch size="sm" onClick={onChangePasswordHandle}>
              Change Password?
            </Switch>
            {changePassword && (
              <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
                <Input
                  name="oldPassword"
                  placeholder="Enter password"
                  label="Old Password"
                  type="password"
                  isRequired
                  control={control}
                  rules={{
                    required: "Old password is required",
                    //   validate: Validate.password,
                  }}
                  error={errors.oldPassword?.message}
                />
                <Input
                  name="password"
                  placeholder="Enter password"
                  label="New Password"
                  type="password"
                  isRequired
                  control={control}
                  rules={{
                    required: "New password is required",
                    //   validate: Validate.password,
                  }}
                  error={errors.password?.message}
                />
              </div>
            )}
            <div className="flex gap-x-4 self-end">
              <CustomButton
                onClick={() => setMode("read")}
                type="button"
                radius="none"
                isDisabled={rolling.for === "update" && rolling.value}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                color="dark"
                radius="none"
                isLoading={rolling.for === "update" && rolling.value}
              >
                Save Changes
              </CustomButton>
            </div>
          </form>
        </>
      ) : (
        <div className="flex flex-col gap-y-2">
          <Text as="p" className="">
            <strong className="mr-2">Full Name:</strong>
            {toTitleCase(userInfo.firstName)} {toTitleCase(userInfo.lastName)}
          </Text>
          <Text as="p" className="">
            <strong className="mr-2">Email:</strong>
            {userInfo.email}
          </Text>
          <Text as="p" className="">
            <strong className="mr-2">Phone:</strong>
            {formatPhoneNumber(userInfo.phoneNumber)}
          </Text>
          <Text as="p" className="">
            <strong className="mr-2">Country:</strong>
            {userInfo.address.country}
          </Text>
          <Text as="p" className="">
            <strong className="mr-2">City:</strong> {userInfo.address.city}
          </Text>
          <Text as="p" className="">
            <strong className="mr-2">Full Address:</strong>{" "}
            {Object.values({
              ...userInfo.address,
              createdAt: "",
              updatedAt: "",
            })
              .filter(Boolean)
              .join(", ")}
          </Text>
          <Text as="p" className="">
            <strong className="mr-2">Member Since:</strong>
            {new Date(userInfo.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
              day: "numeric",
            })}
          </Text>
          <Text as="p" className="">
            <strong className="mr-2">Last Updated:</strong>
            {new Date(userInfo.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </Text>
          <div className="flex gap-x-4 self-end">
            <CustomButton
              onClick={() => setMode("edit")}
              color="dark"
              radius="none"
            >
              Edit Profile
            </CustomButton>
            <CustomButton color="danger" radius="none" onClick={() => onOpen()}>
              Delete Profile
            </CustomButton>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
