import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/notify";
import { toTitleCase } from "../../utils/strings";
import { PRODUCTS_URL } from "../../constants";
import { Image } from "@nextui-org/react";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { sizes } from "../../staticData";
import CreatableSelect from "../../components/CreatableSelect";
import Textarea from "../../components/Textarea";
import Radio from "../../components/Radio";
import CustomInputFile from "../../components/CustomInputFile";
import { CustomButton } from "../../components/CustomButton";

function AddProduct() {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const [rolling, setRolling] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    watch,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      src: [],
      name: "",
      description: "",
      sku: "",
      selling_price: "",
      original_price: "",
      brand: "",
      shipping_price: "",
      available_colors: [],
      available_sizes: [],
      in_stock: false,
    },
  });

  const watchSrc = watch("src");

  const getFormattedData = (data) => {
    const formData = new FormData();
    for (const key in data) {
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

    return formData;
  };

  const onSubmitHandle = async (data) => {
    setRolling(true);
    try {
      const response = await axios.post(
        `${PRODUCTS_URL}`,
        getFormattedData(data),
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      reset();
      navigate(query.get("redirect") || "/admin/products");
      notify("success", response.data.message);
    } catch (error) {
      console.log("Error while adding product:", error.response?.data);
      let message = "Oops! Something went wrong";

      // Check if the error is not from the server
      if (!error.response) message = error.message;
      else if (error.response.status !== 400)
        message = toTitleCase(error.response?.data.error.message);

      if (error.response.status === 400) {
        message = error.response.data.message;
        for (const key in error.response?.data.errors) {
          message = error.response.data.message;
          const value = error.response?.data.errors[key];
          setError(key, { type: "manual", message: value });
        }
      }

      notify("error", message);
    }
    setRolling(false);
  };

  useEffect(() => {
    clearErrors("images");
  }, [watchSrc]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground-600">
          Add Product
        </h2>
      </div>

      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-screen-lg">
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmitHandle)}
        >
          {getValues("src")?.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
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
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <CustomInputFile
              name="src"
              label="Product Images"
              placeholder="Select a file..."
              className="w-1/3"
              multiple={true}
              isRequired
              isInvalid={errors.src ? true : false}
              register={register}
              rules={{ required: "Product image is required" }}
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
            Add Product
          </CustomButton>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
