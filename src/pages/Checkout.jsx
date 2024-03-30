import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CustomButton } from "../components/CustomButton";
import Text from "../components/Text";
import { Avatar, Image } from "@nextui-org/react";
import { notify } from "../utils/notify";
import Page404 from "./Page404";
import axios from "axios";
import { ORDERS_URL } from "../constants";

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleCheckout = async () => {
    console.log("Cart Items: ", cart.cartItems);
    console.log("User Info: ", userInfo);
    if (!cart.cartItems.length) return;
    try {
      let formattedData = {
        ...cart,
        products: cart.cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.selling_price,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          ...userInfo.address,
          street: userInfo.address.street || undefined,
        },
      };
      delete formattedData.cartItems;
      delete formattedData.shippingAddress.createdAt;
      delete formattedData.shippingAddress.updatedAt;
      delete formattedData.showCheckout;

      const response = await axios.post(ORDERS_URL, formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(response.data);
      //   dispatch(setCart(response.data.data));
      notify("success", response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (!cart.showCheckout) return <Page404 />;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <Text as="h3">Checkout</Text>
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8">
        <div className="flex flex-col gap-y-4 w-full">
          {cart.cartItems.map((item) => (
            <div key={item.id} className="flex gap-x-4">
              <Avatar
                radius="md"
                size="lg"
                src={
                  item.images[0].startsWith("https:") ||
                  item.images[0].startsWith("http:")
                    ? item.images[0]
                    : `${BASE_URL}/api/v1/${item.images[0]}`
                }
              />
              <div className="">
                <Text as="p">
                  <strong>Name:</strong> {item.name}
                </Text>
                <div className="flex gap-x-4">
                  <Text as="p">
                    <strong>Size:</strong> {item.size}
                  </Text>
                  <Text as="p">
                    <strong>Color:</strong> {item.color}
                  </Text>
                  <Text as="p">
                    <strong>Quantity:</strong> {item.quantity}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-[42rem] max-w-[42rem]">
          <div className="sticky top-4 left-0 p-4 shadow-md">
            <div className="flex flex-col gap-y-3">
              <Text as="p" className="flex justify-between">
                <strong>Total Items Cost:</strong>
                <span className="font-mono">{cart.itemsPrice}</span>
              </Text>
              <Text as="p" className="flex justify-between">
                <strong>Shipping Price:</strong>
                <span className="font-mono">{cart.shippingPrice}</span>
              </Text>
              <Text as="p" className="flex justify-between">
                <strong>Discount Price:</strong>
                <span className="font-mono">-{cart.discountedPrice}</span>
              </Text>
              <Text as="p" className="flex justify-between">
                <strong>Total Bill:</strong>
                <span>
                  <strong>$</strong>{" "}
                  <strong className="font-mono">{cart.totalPrice}</strong>
                </span>
              </Text>
              <CustomButton
                onClick={handleCheckout}
                color="dark"
                radius="none"
                size="lg"
              >
                Place Order
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
