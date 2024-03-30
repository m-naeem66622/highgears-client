import React from "react";
import Text from "../components/Text";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Avatar,
  Link as NextUI_Link,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { cartColumns } from "../staticData";
import { CustomButton } from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { clearCartItems, removeFromCart, setCart } from "../slices/cartSlice";
import axios from "axios";
import { ORDERS_URL } from "../constants";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    console.log("Cart Items: ", cart.cartItems);
    console.log("User Info: ", userInfo);
    if (!cart.cartItems.length) return;
    try {
      let formattedData = {
        products: cart.cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      const response = await axios.post(
        `${ORDERS_URL}/checkout`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      dispatch(setCart({ ...response.data.data, showCheckout: true }));
      navigate("/checkout");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <Text as="h3">Cart</Text>
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8">
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
  );
};

export default Cart;
