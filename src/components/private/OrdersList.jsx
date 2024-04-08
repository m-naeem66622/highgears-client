import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL, ORDERS_URL } from "../../constants";
import {
  Button,
  ButtonGroup,
  Card,
  Chip,
  Divider,
  Image,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { notify } from "../../utils/notify";
import { CustomButton } from "../CustomButton";
import { Link } from "react-router-dom";
import Text from "../Text";

const statusColorMap = {
  CANCELLED: "danger",
  PENDING: "warning",
  PAID: "success",
  PROCESSING: "warning",
  SHIPPED: "primary",
  COMPLETED: "success",
};

const orderStatuses = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const OrdersList = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 5,
    totalPages: 0,
  });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState({ prev: "", current: "" });
  const [loading, setLoading] = useState(false);

  const formattedQuery = (obj) => {
    return Object.keys(obj)
      .filter((key) => obj[key] !== "")
      .map((key) => key + "=" + obj[key])
      .join("&");
  };

  const fetchOrders = async () => {
    setError(null);
    setLoading(true);
    const query = {
      orderStatus: orderStatus.current,
      limit: pagination.limit,
      page: pagination.currentPage,
    };
    try {
      const response = await axios.get(
        `${ORDERS_URL}?${formattedQuery(query)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setError(null);
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log("Error while fetching orders:", error);
      setPagination({
        limit: pagination.limit,
        currentPage: 1,
        totalOrders: 0,
        totalPages: 0,
      });
      if (error.response.status === 404) {
        setError("No orders found");
        setLoading(false);
        return;
      }
      notify("error", "Error while fetching orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    setPagination({ ...pagination, currentPage: 1 });
  }, [orderStatus.current]);

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, orderStatus.current]);

  const TopContent = (
    <>
      <nav className="hidden md:flex justify-between px-6 py-4 bg-gray-100">
        <ButtonGroup>
          {orderStatuses.map((s) => (
            <Button
              key={s.value}
              onClick={() =>
                setOrderStatus((prev) => ({ prev, current: s.value }))
              }
              color="default"
              variant="bordered"
              radius="none"
              className={`${
                orderStatus.current === s.value
                  ? "border-black border-x-transparent border-t-transparent"
                  : ""
              }`}
            >
              {s.label}
            </Button>
          ))}
        </ButtonGroup>
      </nav>
      <div className="md:hidden">
        <Select
          labelPlacement="outside"
          label="Order Status"
          placeholder="Select order status"
          selectionMode="single"
          className="max-w-sm"
          radius="none"
          selectedKeys={[orderStatus.current]}
          onChange={(e) =>
            setOrderStatus((prev) => ({ prev, current: e.target.value }))
          }
        >
          {orderStatuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );

  const BottomContent = (
    <div className="py-2 px-2 w-full flex justify-between sm:justify-end items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        page={pagination.currentPage}
        total={pagination.totalPages || 1}
        onChange={(page) => setPagination({ ...pagination, currentPage: page })}
        radius="none"
        className=""
        classNames={{ cursor: "bg-black text-white shadow-gray-500" }}
      />
      <div className="flex text-sm justify-end gap-2">
        Showing{" "}
        {pagination.totalOrders
          ? (pagination.currentPage - 1) * pagination.limit + 1
          : 0}{" "}
        -{" "}
        {Math.min(
          pagination.totalOrders
            ? (pagination.currentPage - 1) * pagination.limit + orders.length
            : 0
        )}{" "}
        of {pagination.totalOrders} entries
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        {TopContent}
        <div className="text-center my-8">
          <Spinner label="Loading..." size="lg" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div>
        {TopContent}
        <Text as="h3" className="text-center my-8">
          {error}
        </Text>
        {BottomContent}
      </div>
    );
  }

  return (
    <div>
      {TopContent}
      {orders.map((order) => (
        <Card
          key={order._id}
          className="my-4 p-2 sm:p-4 bg-white rounded shadow-lg"
        >
          <div className="flex flex-col mb-4">
            <div className="flex w-full justify-between">
              <Chip radius="none" color={statusColorMap[order.orderStatus]}>
                {order.orderStatus}
              </Chip>
              <CustomButton
                color="default"
                variant="bordered"
                radius="none"
                size="sm"
                as={Link}
                to={`/user/orders/${order._id}`}
              >
                View Details
              </CustomButton>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between flex-wrap">
              <div className="text-sm text-gray-600">
                <div>
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div>
                  <strong>Placed At: </strong>
                  {new Date(order.placedAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
              <em>{order.paymentMethod}</em>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {order.products.map((item) => (
              <div className="flex gap-x-4 items-start">
                <Link to={`/products/${item.product._id}`}>
                  <Image
                    className="w-20"
                    src={
                      item.product.images[0].startsWith("https:") ||
                      item.product.images[0].startsWith("http:")
                        ? item.product.images[0]
                        : `${BASE_URL}/api/v1/${item.product.images[0]}`
                    }
                  />
                </Link>
                <div className="" key={item.product._id}>
                  <div>Color: {item.color}</div>
                  <div>Size: {item.size}</div>
                  <div>Quantity: {item.qty}</div>
                  <div>Price: {item.price}</div>
                </div>
              </div>
            ))}
          </div>
          <Divider className="my-2" />
          <div className="">
            <strong>Total Price: {order.totalPrice}</strong>
          </div>
        </Card>
      ))}
      {BottomContent}
    </div>
  );
};

export default OrdersList;
