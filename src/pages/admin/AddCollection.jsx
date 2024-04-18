import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/notify";
import { slugify, toTitleCase } from "../../utils/strings";
import { COLLECTIONS_URL, PRODUCTS_URL } from "../../constants";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Radio from "../../components/Radio";
import { CustomButton } from "../../components/CustomButton";
import { Card, CardBody, Chip } from "@nextui-org/react";

function AddCollection() {
  document.title = "Admin | Add Collection | Grand Online Store";
  const navigate = useNavigate();
  const [rolling, setRolling] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      showOnHomepage: true,
      description: "",
      product: "",
      products: [],
    },
  });

  const watchSrc = watch("name");
  const watchProduct = watch("product");
  watch("products");

  const getFormattedData = (data) => {
    const formattedData = {
      ...data,
      products: [...data.products.map((product) => product._id)],
    };

    delete formattedData.product;

    return formattedData;
  };

  const onSubmitHandle = async (data) => {
    setRolling(true);
    try {
      const response = await axios.post(
        `${COLLECTIONS_URL}`,
        getFormattedData(data),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      reset();
      navigate(query.get("redirect") || "/admin/collections");
      notify("success", response.data.message);
    } catch (error) {
      console.log("Error while adding collection:", error.response?.data);
      let message = "Oops! Something went wrong";

      // Check if the error is not from the server
      if (!error.response) message = error.message;
      else if (error.response.status !== 400)
        message = toTitleCase(error.response?.data.error.message);

      if (error.response.status === 400) {
        message = error.response?.data.message;
        for (const key in error.response?.data.errors) {
          const value = error.response?.data.errors[key];
          setError(key, { type: "manual", message: value });
        }
      }

      notify("error", message);
    }
    setRolling(false);
  };

  const productIdValidation = (productId) => {
    // Validation for product ID
    if (!productId) return "Product ID is required";
    else if (!(productId.length === 24))
      return "Product ID must be 24 characters long";
    else if (!/^[0-9a-fA-F]+$/.test(productId))
      return "Product ID must be a valid hexadecimal string";
  };

  const fetchProductDetail = async (productId) => {
    // Validation for product ID
    const error = productIdValidation(productId);
    if (error) return setError("product", { type: "manual", message: error });

    // Check if the product is already added
    if (
      getValues("products").find(
        (product) => product._id === productId.toLowerCase()
      )
    )
      return setError("product", {
        type: "manual",
        message: "Product already added",
      });

    // All good, fetch product details
    try {
      const response = await axios.get(
        `${PRODUCTS_URL}/${productId}?queryType=list`
      );
      setValue("products", [...getValues("products"), response.data.data]);
      setValue("product", "");
      notify("success", "Product added successfully");
    } catch (error) {
      console.log("Error while fetching product:", error.response?.data);
      const { response } = error;
      let message = "";
      if (!response) message = error.message;
      else if (response.status === 400) {
        message = response.data.message;
        if (response.data.errors.queryType)
          setError("product", {
            type: "manual",
            message: response.data.errors.queryType,
          });
        else if (response.data.errors.id)
          setError("product", {
            type: "manual",
            message: response.data.errors.id,
          });
      } else if (response.status === 404) {
        message = response.data.error.message;
        setError("product", {
          type: "manual",
          message: response.data.error.message,
        });
      }
      notify("error", message);
    }
  };

  useEffect(() => {
    if (watchSrc) {
      clearErrors("slug");
      const slug = slugify(watchSrc);
      setValue("slug", slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSrc]);

  useEffect(() => {
    if (watchProduct && errors.product) {
      let error = productIdValidation(watchProduct);
      if (error) setError("product", { type: "manual", message: error });
      else clearErrors("product");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchProduct]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground-600">
          Add Collection
        </h2>
      </div>

      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-screen-lg">
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmitHandle)}
        >
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Input
              name="name"
              placeholder="Nike Dri-FIT Team"
              label="Collection Name"
              isRequired
              control={control}
              rules={{ required: "Product name is required" }}
              error={errors.name?.message}
            />
            <Input
              name="slug"
              placeholder="nike-dri-fit-team"
              label="Collection Slug"
              inputProps={{ isReadOnly: true }}
              control={control}
              rules={{ required: "Selling price is required" }}
              error={errors.selling_price?.message}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6">
            <Radio
              name="showOnHomepage"
              label="Show on Homepage"
              className=""
              items={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              control={control}
              error={errors.showOnHomepage?.message}
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
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-6 items-end">
            <Input
              name="product"
              placeholder="1da502642533bf4878b9a522"
              label="Products"
              control={control}
              error={errors.product?.message}
            />
            <CustomButton
              color="dark"
              radius="none"
              type="button"
              className="w-1/4"
              size="lg"
              onClick={() => {
                fetchProductDetail(getValues("product"));
              }}
            >
              Add Product
            </CustomButton>
          </div>
          <CustomButton
            color="dark"
            radius="none"
            type="submit"
            className="w-full"
            isLoading={rolling}
          >
            Add Collection
          </CustomButton>
          <div className="flex flex-col gap-y-6">
            {getValues("products").map((product) => (
              <Card key={product._id} radius="none">
                <CardBody>
                  <div className="flex justify-between">
                    <small>
                      <strong>Product ID:</strong> {product._id}
                    </small>

                    <Chip
                      className="capitalize"
                      color={product.in_stock ? "success" : "danger"}
                      size="md"
                      variant="flat"
                      radius="none"
                    >
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Chip>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="">
                      <strong>Product Name:</strong> <span>{product.name}</span>
                    </div>
                    <CustomButton
                      color="dark"
                      radius="none"
                      size="sm"
                      className="ml-4"
                      type="button"
                      onClick={() =>
                        setValue(
                          "products",
                          getValues("products").filter(
                            (item) => item._id !== product._id
                          )
                        )
                      }
                    >
                      Remove
                    </CustomButton>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCollection;
