import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Validate from "../utils/validators";
import { toTitleCase } from "../utils/strings";
import { notify } from "../utils/notify";
import { setCredentials } from "../slices/authSlice";
import { AUTH_URL } from "../constants";
import Input from "../components/Input";
import { CustomButton } from "../components/CustomButton";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const [rolling, setRolling] = useState(false);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitHandle = async (data) => {
    setRolling(true);
    try {
      const response = await axios.post(`${AUTH_URL}/login`, data);
      dispatch(setCredentials(response.data));
      if (response.data.data.isAdmin)
        navigate(query.get("redirect") || "/admin/orders");
      else navigate(query.get("redirect") || "/");
      notify("success", "You have successfully signed in!");
    } catch (error) {
      console.log("Error while login:", error.response?.data);
      let notifyMsg = {
        type: "error",
        message: "Oops! Something went wrong...",
      };

      // Check if the error not from the server
      if (!error.response) notifyMsg.message = error.message;

      if (error.response?.status === 401)
        notifyMsg.message = toTitleCase(error.response.data.error.message);

      notify(notifyMsg.type, notifyMsg.message);
    }
    setRolling(false);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmitHandle)}
        >
          <Input
            name="email"
            placeholder="example@email.com"
            label="Email"
            type="email"
            isRequired
            control={control}
            rules={{ required: "Email is required", validate: Validate.email }}
            error={errors.email?.message}
          />
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
          <div className="text-sm text-right">
            <Link to="#" className="font-semibold">
              Forgot password?
            </Link>
          </div>

          <div>
            <CustomButton
              color="dark"
              radius="none"
              type="submit"
              className="w-full"
              isLoading={rolling}
            >
              Sign in
            </CustomButton>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-base-content">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-info-content ml-1"
          >
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
