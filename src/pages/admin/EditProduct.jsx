import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/notify";
import { toTitleCase } from "../../utils/strings";
import { BASE_URL, PRODUCTS_URL } from "../../constants";
import { Badge, Image, Spinner } from "@nextui-org/react";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { sizes } from "../../staticData";
import CreatableSelect from "../../components/CreatableSelect";
import Textarea from "../../components/Textarea";
import Radio from "../../components/Radio";
import CustomInputFile from "../../components/CustomInputFile";
import { CustomButton } from "../../components/CustomButton";

const defaultValues = {
  src: [],
  name: "",
  description: "",
  sku: "",
  selling_price: "",
  original_price: "",
  shipping_price: "",
  brand: "",
  available_colors: [],
  available_sizes: [],
  in_stock: false,
};

function EditProduct() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [imagesUrl, setImagesUrl] = useState([]); // To hold images url already stored on server
  const [error, setError] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
    clearErrors,
    setError: setErrors,
  } = useForm({ defaultValues });

  const watchSrc = watch("src");

  const getFormattedData = (data) => {
    const formData = new FormData();
    for (const key in defaultValues) {
      if (key === "src") {
        Array.from(data[key]).forEach((item) => {
          formData.append(key, item);
        });
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => {
          formData.append(`${key}[]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    }
    imagesUrl.forEach((url) => formData.append("images[]", url));

    return formData;
  };

  const onSubmitHandle = async (data) => {
    setRolling(true);
    try {
      const response = await axios.put(
        `${PRODUCTS_URL}/${_id}`,
        getFormattedData(data),
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      navigate(query.get("redirect") || "/admin/products");
      notify("success", response.data.message);
    } catch (error) {
      console.log("Error while updating product:", error.response?.data);
      let message = "Oops! Something went wrong";

      // Check if the error is not from the server
      if (!error.response) message = error.message;
      else if (error.response.status !== 400)
        message = toTitleCase(error.response?.data.error.message);

      if (error.response.status === 400) {
        for (const key in error.response?.data.errors) {
          message = error.response.data.message;
          const value = error.response?.data.errors[key];
          setErrors(key, { type: "manual", message: value });
        }
      }

      notify("error", message);
    }
    setRolling(false);
  };

  useEffect(() => {
    clearErrors("images");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSrc]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${PRODUCTS_URL}/${_id}`);
      document.title = `Admin | Edit Product - ${response.data.data.name} | Grand Online Store`;
      for (const key in response.data.data) {
        if (key === "images") {
          setImagesUrl(response.data.data[key]);
        } else {
          setValue(key, response.data.data[key]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("Error while fetching product:", error.response?.data);
      let errorObj = {};
      if (!error.response) {
        errorObj = { message: error.message, code: error.code };
      }
      errorObj = { ...error.response.data.error, code: error.response.status };
      setError(errorObj);
      notify("error", "Error while fetching product");
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  useEffect(() => {
    document.title = "Admin | Edit Product | Grand Online Store";
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner size="lg" label="Loading..." />
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground-600">
          Update Product
        </h2>
      </div>

      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-screen-lg">
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmitHandle)}
        >
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6 flex-wrap">
            {Array.from(getValues("src")).map((image, index) => (
              <Image
                key={index}
                classNames={{
                  wrapper: "aspect-square w-32 h-32",
                  img: "an-image-element h-full w-full object-cover",
                }}
                src={URL.createObjectURL(image)}
              />
            ))}
            {imagesUrl.map((image, index) => (
              <Badge
                key={index}
                className="cursor-pointer"
                content="X"
                size="lg"
                color="danger"
                shape="rectangle"
                onClick={() => {
                  setImagesUrl(imagesUrl.filter((img, i) => i !== index));
                }}
              >
                <Image
                  classNames={{
                    wrapper: "aspect-square w-32 h-32",
                    img: "an-image-element h-full w-full object-cover",
                  }}
                  src={
                    image.startsWith("https:") || image.startsWith("http:")
                      ? image
                      : `${BASE_URL}/api/v1/${image}`
                  }
                />
              </Badge>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <CustomInputFile
              name="src"
              label="Product Images"
              placeholder="Select a file..."
              className="w-1/3"
              multiple={true}
              isRequired={
                getValues("src").length + imagesUrl.length ? false : true
              }
              isInvalid={errors.src ? true : false}
              register={register}
              rules={
                getValues("src").length + imagesUrl.length
                  ? {}
                  : { required: "Product image is required" }
              }
              errorMessage={errors.src?.message || errors.images?.message}
            />
            <Input
              name="name"
              placeholder="Nike Dri-FIT Team"
              className="w-2/3"
              label="Product Name"
              isRequired
              control={control}
              rules={{ required: "Product name is required" }}
              error={errors.name?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Input
              name="selling_price"
              placeholder="1000"
              label="Selling Price"
              type="number"
              isRequired
              control={control}
              rules={{
                required: "Selling price is required",
                min: {
                  value: 0,
                  message: "Selling price must be greater than or equal to 0",
                },
              }}
              error={errors.selling_price?.message}
            />
            <Input
              name="original_price"
              placeholder="1200"
              label="Original Price"
              type="number"
              isRequired
              control={control}
              rules={{
                required: "Original price is required",
                min: {
                  value: 0,
                  message: "Original price must be greater than or equal to 0",
                },
              }}
              error={errors.original_price?.message}
            />
            <Input
              name="sku"
              placeholder="SKU-1234"
              label="SKU"
              isRequired
              control={control}
              rules={{ required: "SKU is required" }}
              error={errors.sku?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Radio
              name="in_stock"
              label="Availability"
              className="w-1/3"
              items={[
                { label: "Instock", value: true },
                { label: "Out of Stock", value: false },
              ]}
              control={control}
              error={errors.in_stock?.message}
            />
            <CreatableSelect
              name="available_colors"
              label="Available Colors"
              className="w-2/3"
              isRequired
              control={control}
              error={errors.available_colors?.message}
              rules={{ required: "Available colors is required" }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Input
              name="brand"
              placeholder="Nike"
              label="Brand"
              isRequired
              control={control}
              rules={{ required: "Brand is required" }}
              error={errors.brand?.message}
            />
            <Input
              name="shipping_price"
              placeholder="100"
              label="Shipping Price"
              type="number"
              isRequired
              control={control}
              rules={{
                required: "Shipping price is required",
                min: {
                  value: 0,
                  message: "Shipping price must be greater than or equal to 0",
                },
              }}
              error={errors.shipping_price?.message}
            />
            <Select
              name="available_sizes"
              placeholder="Select Sizes"
              label="Available Sizes"
              selectionMode="multiple"
              isRequired
              selectItems={sizes}
              control={control}
              rules={{ required: "Available sizes is required" }}
              error={errors.available_sizes?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Textarea
              name="description"
              placeholder=""
              label="Description"
              isRequired
              control={control}
              rules={{ required: "Description is required" }}
              error={errors.description?.message}
            />
          </div>
          <CustomButton
            color="dark"
            radius="none"
            type="submit"
            className="w-full"
            isLoading={rolling}
          >
            Update Product
          </CustomButton>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
