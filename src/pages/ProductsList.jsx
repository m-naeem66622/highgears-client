import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import AdvanceFilter from "../components/AdvanceFilter";
import Text from "../components/Text";
import { priceRange } from "../staticData";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { PRODUCTS_URL } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { addProducts, setProducts } from "../slices/productsSlice";
import { notify } from "../utils/notify";

const ProductsList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const products = useSelector((state) => state.products);

  const name = "All Products";
  const description =
    "Immerse yourself in our diverse collection of products, designed to cater to all your needs and preferences.";

  const fetchProducts = async (initial = false) => {
    try {
      const response = await axios.get(
        `${PRODUCTS_URL}?limit=${products.pagination.limit}&page=${products.pagination.currentPage}&queryType=card`
      );

      if (initial) {
        dispatch(setProducts(response.data));
      } else {
        dispatch(addProducts(response.data));
      }
    } catch (error) {
      console.log("fetchProducts -> error", error);

      let errorObj = {};
      if (!error.response) {
        errorObj = { message: error.message, code: error.code };
      } else {
        errorObj = {
          ...error.response.data.error,
          code: error.response.status,
        };
      }
      setError(errorObj);
      notify("error", "Error while fetching product", {
        toastId: error.code,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!products.data.length) fetchProducts(true);
    setLoading(false);
  }, []);

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
    <div className="">
      <div className="bg-neutral-800 py-14 text-center">
        <Text as="h2" className="text-white">
          {name}
        </Text>
        <Text as="p" className="text-neutral-400 mt-6 sm:text-lg">
          {description}
        </Text>
      </div>

      <div className="">
        <InfiniteScroll
          className="mt-8 flex flex-wrap gap-x-3 gap-y-6 justify-center"
          dataLength={products.data.length} //This is important field to render the next data
          next={fetchProducts}
          hasMore={
            products.pagination.currentPage < products.pagination.totalPages
          }
          loader={<Spinner label="Loading..." size="lg" />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {products.data.map((product) => (
            <ProductCard key={product._id} data={product} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProductsList;
