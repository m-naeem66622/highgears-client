import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { notify } from "../../utils/notify";
import { slugify, toTitleCase } from "../../utils/strings";
import { COLLECTIONS_URL, PRODUCTS_URL } from "../../constants";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Radio from "../../components/Radio";
import { CustomButton } from "../../components/CustomButton";
import {
  Input as NextUI_Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Spinner,
} from "@nextui-org/react";

function EditCollection() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const [product, setProduct] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
    clearErrors,
    setError: setErrors,
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
  const watchProducts = watch("products");
  const watchProduct = watch("product");

  const getFormattedData = (data) => {
    const formattedData = {
      ...data,
      products: [...data.products.map((product) => product._id)],
    };

    delete formattedData.product;

    return formattedData;
  };

  const onSubmitHandle = async (data) => {
    try {
      const response = await axios.put(
        `${COLLECTIONS_URL}/${slug}`,
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
      let message = "Oops! Something went wrong";

      // Check if the error is not from the server
      if (!error.response) message = error.message;
      else if (error.response.status !== 400)
        message = toTitleCase(error.response?.data.error.message);

      if (error.response.status === 400) {
        message = error.response?.data.message;
        for (const key in error.response?.data.errors) {
          const value = error.response?.data.errors[key];
          setErrors(key, { type: "manual", message: value });
        }
      }

      console.log("Error:", error.response?.data);
      notify("error", message);
    }
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
    if (error) return setErrors("product", { type: "manual", message: error });

    // Check if the product is already added
    if (
      getValues("products").find(
        (product) => product._id === productId.toLowerCase()
      )
    )
      return setErrors("product", {
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
      const { response } = error;
      let message = "";
      if (!response) message = error.message;
      else if (response.status === 400) {
        message = response.data.message;
        if (response.data.errors.queryType)
          setErrors("product", {
            type: "manual",
            message: response.data.errors.queryType,
          });
        else if (response.data.errors.id)
          setErrors("product", {
            type: "manual",
            message: response.data.errors.id,
          });
      } else if (response.status === 404) {
        message = response.data.error.message;
        setErrors("product", {
          type: "manual",
          message: response.data.error.message,
        });
      }
      console.log("Error:", error.response?.data);
      notify("error", message);
    }
  };

  const fetchCollection = async () => {
    try {
      const response = await axios.get(
        `${COLLECTIONS_URL}/${slug}?queryType=list`
      );
      for (const key in response.data.data) {
        if (!["_id", "createdAt", "updatedAt", "__v", "_id"].includes(key)) {
          setValue(key, response.data.data[key]);
        }
      }
    } catch (error) {
      console.log("Error while fetching collection:", error);
      let errorObj = {};
      if (!error.response) {
        errorObj = { message: error.message, code: error.code };
      }
      errorObj = { ...error.response.data, code: error.response.status };
      setError(errorObj);
      notify("error", "Error while fetching collection");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (watchSrc) {
      clearErrors("slug");
      const slug = slugify(watchSrc);
      setValue("slug", slug);
    }
  }, [watchSrc]);

  useEffect(() => {
    if (watchProduct && errors.product) {
      let error = productIdValidation(watchProduct);
      if (error) setErrors("product", { type: "manual", message: error });
      else clearErrors("product");
    }
  }, [watchProduct]);

  useEffect(() => {
    fetchCollection();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner size="lg" label="Loading..." />
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground-600">
          Update Collection
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
          >
            Update Collection
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

export default EditCollection;
