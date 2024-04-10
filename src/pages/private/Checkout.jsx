import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton } from "../../components/CustomButton";
import Text from "../../components/Text";
import { Avatar , Spinner } from "@nextui-org/react";
import { notify } from "../../utils/notify";
import Page404 from "../Page404";
import axios from "axios";
import { ORDERS_URL } from "../../constants";
import { resetCart } from "../../slices/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleCheckout = async (form) => {
    console.log("Cart Items: ", cart.cartItems);
    console.log("User Info: ", userInfo);
    if (!cart.cartItems.length) return;
    setRolling(true);
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
      delete formattedData.formParameters;
      delete formattedData.cartItems;
      delete formattedData.shippingAddress.createdAt;
      delete formattedData.shippingAddress.updatedAt;
      delete formattedData.showCheckout;

      const response = await axios.post(ORDERS_URL, formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      notify("success", response.data.message);
      setRolling(false);

      setLoading(true);
      dispatch(resetCart());

      form.submit();
    } catch (error) {
    setRolling(false);
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    const form = e.target;
    form.action =
      "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";
    form.method = "POST";
    handleCheckout(form);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner label="Loading..." size="lg" />
      </div>
    );
  }

  if (!cart.showCheckout) return <Page404 />;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <Text as="h3">Checkout</Text>
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8">
        <div className="w-full">
          <div className="mb-4">
            <Text as="h4" className="mb-2">
              Shipping Address
            </Text>
            <Text as="p">
              {userInfo.address.country}, {userInfo.address.state},{" "}
              {userInfo.address.city}, {userInfo.address.street} -{" "}
              {userInfo.address.zipCode}
            </Text>
          </div>
          <div className="flex flex-col gap-y-4 w-full">
            {cart.cartItems.map((item) => (
              <div key={item._id} className="flex gap-x-4">
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
        </div>
        <div className="w-[42rem] max-w-[42rem]">
          <div className="sticky top-4 left-0 p-4 shadow-md">
            <form
              // method="POST"
              // action="https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
              className="flex flex-col gap-y-3"
              onSubmit={onSubmitHandle}
            >
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
              {Object.keys(cart.formParameters).map((key) =>
                // If the value is an array again map it like nesting using input element

                // The structure of Array Items will be like this an Object with SKU, NAME, PRICE, QTY map it accordingly
                // ITEMS: cart.cartItems.map((item) => ({
                //   SKU: item.sku,
                //   NAME: item.name,
                //   PRICE: item.selling_price * item.quantity,
                //   QTY: item.quantity,
                // })),
                Array.isArray(cart.formParameters[key]) ? (
                  cart.formParameters[key].map((item, index) =>
                    Object.keys(item).map((itemKey) => (
                      <input
                        key={`${key}[${index}][${itemKey}]`}
                        // id={key}
                        name={`${key}[${index}][${itemKey}]`}
                        type="hidden"
                        value={item[itemKey]}
                      />
                    ))
                  )
                ) : (
                  <input
                    key={key}
                    // id={key}
                    name={key}
                    type="hidden"
                    value={cart.formParameters[key]}
                  />
                )
              )}
              <Text className="text-blue-600 text-sm">
                Please note: When you click "Place Order", your order will be
                placed and you will then be redirected to the payment page to
                complete your purchase.
              </Text>
              <CustomButton
                // onClick={handleCheckout}
                color="dark"
                radius="none"
                size="lg"
                type="submit"
                isLoading={rolling}
              >
                Place Order
              </CustomButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
