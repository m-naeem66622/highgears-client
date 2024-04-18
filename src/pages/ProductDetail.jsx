import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { notify } from "../utils/notify";
import { sizes } from "../staticData";
import Text from "../components/Text";
import {
  ButtonGroup,
  Card,
  CardBody,
  Chip,
  Image,
  Input,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { CustomRadio } from "../components/CustomRadio";
import { CustomButton } from "../components/CustomButton";
import { BASE_URL, PRODUCTS_URL } from "../constants";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { _id } = useParams();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(
    cartItems.find((item) => item._id === _id)?.size || ""
  );
  const [color, setColor] = useState(
    cartItems.find((item) => item._id === _id)?.color || ""
  );

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${PRODUCTS_URL}/${_id}`);
      console.log("Product fetched:", response.data.data);
      document.title = `Buy ${response.data.data.name} | Grand Online Store`;
      setData(response.data.data);
    } catch (error) {
      console.log("Error while fetching product:", error.response?.data);
      let errorObj = {};
      if (!error.response) {
        errorObj = { message: error.message, code: error.code };
      } else {
        errorObj = { ...error.response.data.error, code: error.response.status };
      }
      setError(errorObj);
      setLoading(false);
      notify("error", "Error while fetching product");
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!size) {
      notify("error", "Please select a size");
      return;
    }
    if (!color) {
      notify("error", "Please select a color");
      return;
    }
    dispatch(addToCart({ ...data, quantity, size, color }));
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  useEffect(() => {
    document.title = "Product Detail | Grand Online Store";
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner label="Loading..." size="lg" />
      </div>
    );
  }

  if (error) {
    document.title = `${error.code} Error - ${error.message} | Grand Online Store`;
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Images */}
        <div className="md:col-span-2 lg:col-span-1">
          <Image
            src={
              (data.images &&
                data.images[selectedImage]?.startsWith("https:")) ||
              data.images[selectedImage]?.startsWith("http:")
                ? data.images[selectedImage]
                : `${BASE_URL}/api/v1/${data.images[selectedImage]}`
            }
            alt={data.name}
            classNames={{
              wrapper: "w-full aspect-[4/3]",
            }}
          />
          <div className="flex mt-2 gap-x-3">
            {data.images.map((image, index) => (
              <div
                key={index}
                className={`w-1/6 cursor-pointer relative aspect-square ${
                  index === selectedImage
                    ? "border-2 border-black rounded-xl"
                    : ""
                }`}
                onClick={() => handleImageSelect(index)}
              >
                <Image
                  src={
                    image.startsWith("https:") || image.startsWith("http:")
                      ? image
                      : `${BASE_URL}/api/v1/${image}`
                  }
                  alt={data.name}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="md:col-span-2 lg:col-span-1">
          <div className="flex flex-col gap-y-6 sticky top-4 left-0">
            <div className="flex flex-col gap-y-1">
              <Text as="h2">{data.name}</Text>
              <div className="mb-2 lg:text-lg flex items-center">
                <span className="text-black text-2xl font-bold mr-1">$</span>
                <span className="text-black font-bold text-2xl mr-2">
                  {Number(data.selling_price).toFixed(2)}
                </span>
                <span className="text-red-500 line-through text-lg mr-1">
                  $
                </span>
                <span className="text-red-500 line-through text-lg">
                  {Number(data.original_price).toFixed(2)}
                </span>
                <Chip color="success" size="md" className="ml-4">
                  {100 -
                    ((data.selling_price / data.original_price) * 100).toFixed(
                      0
                    )}
                  % off
                </Chip>
              </div>
              <div className="">
                <Chip
                  radius="none"
                  color={data.in_stock ? "success" : "danger"}
                  size="lg"
                >
                  {data.in_stock ? "In Stock" : "Out of Stock"}
                </Chip>
              </div>
              {data.shipping_price === 0 && (
                <div className="flex items-center gap-x-2">
                  <span className="text-green-500">
                    <i className="fas fa-shipping-fast"></i>
                  </span>
                  <span className="text-green-500 font-semibold">
                    Free Shipping
                  </span>
                </div>
              )}
            </div>

            <div className="">
              <RadioGroup
                label="Select Size"
                value={size}
                orientation="horizontal"
              >
                {data.available_sizes.map((size, index) => (
                  <CustomRadio
                    key={index}
                    value={size}
                    label={size}
                    checked={sizes.includes(size)}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    {size}
                  </CustomRadio>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Select
                name="colors"
                placeholder="Select"
                label="Select Colors"
                selectionMode="single"
                className="w-60"
                labelPlacement="outside"
                onChange={(e) => setColor(e.target.value)}
                selectedKeys={[color]}
                radius="none"
              >
                {data.available_colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="">
              <ButtonGroup className="">
                <CustomButton
                  color="dark"
                  radius="none"
                  className="min-w-fit"
                  onClick={() =>
                    setQuantity(quantity - 1 > 1 ? quantity - 1 : 1)
                  }
                >
                  <i className="fa-solid fa-minus"></i>
                </CustomButton>
                <Input
                  type="number"
                  value={quantity}
                  radius="none"
                  variant="bordered"
                  className="w-32"
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <CustomButton
                  color="dark"
                  radius="none"
                  className="min-w-fit"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i className="fa-solid fa-plus"></i>
                </CustomButton>
              </ButtonGroup>
              {quantity > 1 ? (
                <div className="font-semibold mt-2">
                  Total Price: {parseFloat(data.selling_price) * quantity}
                </div>
              ) : null}
            </div>

            <div className="">
              <div className="flex gap-x-3">
                <CustomButton
                  color={data.in_stock ? "dark" : "default"}
                  radius="none"
                  onClick={handleAddToCart}
                  disabled={data.in_stock ? false : true}
                >
                  {cartItems.some((item) => item._id === data._id)
                    ? "Update Cart"
                    : data.in_stock
                    ? "Add to Cart"
                    : "Out of Stock"}
                </CustomButton>
                {cartItems.some((item) => item._id === data._id) && (
                  <CustomButton
                    color="danger"
                    radius="none"
                    onClick={() => dispatch(removeFromCart(data._id))}
                  >
                    Remove from Cart
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Tabs aria-label="Description Tab" radius="none" variant="underlined">
          <Tab key="description" title="Description">
            <Card radius="none">
              <CardBody>{data.description}</CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default ProductDetail;
