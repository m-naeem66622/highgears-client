import React, { useState } from "react";
import Text from "../components/Text";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Avatar,
  Link as NextUI_Link,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { cartColumns } from "../staticData";
import { CustomButton } from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, setCart } from "../slices/cartSlice";
import axios from "axios";
import { ORDERS_URL } from "../constants";
import { formatPhoneNumber, toTitleCase } from "../utils/strings";
import { notify } from "../utils/notify";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cart = useSelector((state) => state.cart);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "images":
        return (
          <Link to={`/products/${item._id}`}>
            <Avatar src={cellValue[0]} radius="md" size="lg" />
          </Link>
        );

      case "actions":
        return (
          <CustomButton
            variant="bordered"
            className="px-0 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            isIconOnly
            size="sm"
            radius="full"
            onClick={() => dispatch(removeFromCart(item._id))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CustomButton>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleCheckout = async () => {
    if (!cart.cartItems.length) return;
    setRolling(true);
    try {
      let formattedData = {
        products: cart.cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      };
      const response = await axios.post(
        `${ORDERS_URL}/checkout`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const formParameters = {
        ...response.data.data.formParameters,
        CUSTOMER_MOBILE_NO: formatPhoneNumber(userInfo.phoneNumber),
        CUSTOMER_EMAIL_ADDRESS: userInfo.email,
        TXNDESC: "Payment for products",
        SUCCESS_URL: `${window.location.origin}/user/orders/${response.data.data._id}`,
        FAILURE_URL: `${window.location.origin}/user/orders/${response.data.data._id}`,
        CHECKOUT_URL: `${ORDERS_URL}/payfast/checkout`,
        ORDER_DATE: new Date().toISOString().substring(0, 10),
        CUSTOMER_NAME: `${userInfo.firstName} ${userInfo.lastName}`,
        CUSTOMER_ID: userInfo._id,
        COUNTRY: userInfo.address.country,
        SHIPPING_STATE_PROVINCE: userInfo.address.state,
        SHIPPING_ADDRESS_CITU: userInfo.address.city,
        SHIPPING_POSTALCODE: userInfo.address.zipCode,
        SHIPPING_ADDRESS_1: `${userInfo.address.street}, ${userInfo.address.city}, ${userInfo.address.state}, ${userInfo.address.country} - ${userInfo.address.zipCode}`,
        ITEMS: cart.cartItems.map((item) => ({
          SKU: item.sku,
          NAME: item.name,
          PRICE: item.selling_price * item.quantity,
          QTY: item.quantity,
        })),
      };
      dispatch(
        setCart({ ...response.data.data, showCheckout: true, formParameters })
      );
      navigate("/checkout");
    } catch (error) {
      console.log("Error while checking out:", error.response?.data);
      let message = "Oops! Something went wrong";

      // Check if the error is not from the server
      if (!error.response) message = error.message;
      else if (error.response.status !== 400)
        message = toTitleCase(error.response?.data?.error?.message);

      if (error.response.status === 400) {
        message = error.response?.data.message;
      }

      notify("error", message);
    }
    setRolling(false);
  };

  return (
    <>
      <div className="mb-8">
        <div className="mb-4">
          <Text as="h3">Cart</Text>
        </div>
        <div className="flex flex-col lg:flex-row gap-x-8">
          <div className="">
            {userInfo && (
              <div className="">
                <div className="flex justify-between items-center">
                  <Text as="h4" className="mb-2">
                    Shipping Address
                  </Text>
                  <NextUI_Link
                    as={Link}
                    to="/user/account?tab=profile&redirect=/cart"
                    underline
                  >
                    Edit
                  </NextUI_Link>
                </div>
                <Text as="p">
                  {userInfo.address.country}, {userInfo.address.state},{" "}
                  {userInfo.address.city}, {userInfo.address.street} -{" "}
                  {userInfo.address.zipCode}
                </Text>
              </div>
            )}
            <Table
              aria-label="Cart Table"
              radius="none"
              bottomContentPlacement="outside"
              classNames={{
                tr: "first:rounded-none last:rounded-none",
                th: "first:rounded-none last:rounded-none bg-black text-white",
              }}
            >
              <TableHeader columns={cartColumns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={cart.cartItems}
                emptyContent={"No products in cart"}
              >
                {(item) => (
                  <TableRow key={item._id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {cart.cartItems.length > 0 && (
            <div className="w-[42rem] max-w-[42rem]">
              <div className="sticky top-4 left-0 p-4 shadow-md">
                <div className="flex flex-col gap-y-3">
                  <Text as="p" className="flex justify-between">
                    <strong>Total Items Cost:</strong>
                    <span className="font-mono">{cart.itemsPrice}</span>
                  </Text>
                  <Text as="p" className="flex justify-between">
                    <strong> Shipping Price:</strong>
                    <span className="font-mono">{cart.shippingPrice}</span>
                  </Text>
                  <Text as="p" className="flex justify-between">
                    <strong> Discount Price:</strong>
                    <span className="font-mono">-{cart.discountedPrice}</span>
                  </Text>
                  <Text as="p" className="flex justify-between">
                    <strong> Total Bill:</strong>
                    <span>
                      <strong>$</strong>{" "}
                      <strong className="font-mono">{cart.totalPrice}</strong>
                    </span>
                  </Text>
                  {userInfo ? (
                    <CustomButton
                      onClick={handleCheckout}
                      color="dark"
                      radius="none"
                      size="lg"
                      isLoading={rolling}
                    >
                      Checkout
                    </CustomButton>
                  ) : (
                    <CustomButton
                      as={Link}
                      to="/login?redirect=/cart"
                      color="dark"
                      radius="none"
                      size="lg"
                    >
                      Login to Checkout
                    </CustomButton>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
