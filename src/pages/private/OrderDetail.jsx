import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ORDERS_URL } from "../../constants";
import { Chip, Image, Spinner } from "@nextui-org/react";
import { notify } from "../../utils/notify";
import axios from "axios";
import { formatPhoneNumber } from "../../utils/strings";

const statusColorMap = {
  CANCELLED: "danger",
  PENDING: "warning",
  PAID: "success",
  PROCESSING: "warning",
  SHIPPED: "primary",
  COMPLETED: "success",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${ORDERS_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log("Error while fetching order:", error.response?.data);
      let errorObj = {};
      if (!error.response) {
        errorObj = { message: error.message, code: error.code };
      } else {
        errorObj = { ...error.response.data, code: error.response.status };
      }
      setError(errorObj);
      notify("error", "Error while fetching order");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner label="Loading..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">
          {error.code} Error
        </h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Order Details</h2>
          <p className=" text-gray-500">Order ID: {order._id}</p>
          <p className=" text-gray-500">
            Placed At: {new Date(order.placedAt).toLocaleString()}
          </p>
        </div>
        <div>
          <Chip radius="none" color={statusColorMap[order.orderStatus]}>
            {order.orderStatus}
          </Chip>
        </div>
      </div>

      {/* User Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">User Information</h3>
        <p className=" text-gray-500">
          Name: {order.user.firstName} {order.user.lastName}
        </p>
        <p className=" text-gray-500">Email: {order.user.email}</p>
        <p className=" text-gray-500">
          Phone: {formatPhoneNumber(order.user.phoneNumber)}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <p className=" text-gray-500">{order.shippingAddress.street}</p>
      </div>

      {/* Products */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Products</h3>
        {order.products.map((item) => (
          <div className="flex items-center mb-2" key={item.product._id}>
            <Image
              className="w-12 h-12 object-cover rounded-sm mr-4"
              src={item.product.images[0]}
              alt={item.product.name}
            />
            <div>
              <p className=" font-semibold">{item.product.name}</p>
              <p className=" text-gray-500">Color: {item.color}</p>
              <p className=" text-gray-500">Size: {item.size}</p>
              <p className=" text-gray-500">Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Pricing Details</h3>
        <p className=" text-gray-500">Items Price: {order.itemsPrice}</p>
        <p className=" text-gray-500">Shipping Price: {order.shippingPrice}</p>
        <p className=" text-gray-500">
          Discounted Price: {order.discountedPrice}
        </p>
        <p className=" text-gray-500">Total Price: {order.totalPrice}</p>
      </div>

      {/* Payment */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        <p className=" text-gray-500">Payment Method: {order.paymentMethod}</p>
        <Chip
          radius="none"
          size="sm"
          color={statusColorMap[order.paymentStatus]}
        >
          {order.paymentStatus}
        </Chip>
      </div>
    </div>
  );
};

export default OrderDetail;
