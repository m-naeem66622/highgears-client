import React from "react";
import Text from "../components/Text";
import { CustomButton } from "../components/CustomButton";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Text as="h2" className="mb-4">
          Oops! Page Not Found
        </Text>
        <Text as="p" className="text-lg mb-4 text-center">
          We're sorry, but the page you are looking for does not exist.
        </Text>
        <CustomButton color="dark" radius="none" as={Link} to="/">
          Go to Homepage
        </CustomButton>
      </div>
    </>
  );
};

export default Page404;
