import React, { useEffect, useState } from "react";
import Text from "../components/Text";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { CustomButton } from "../components/CustomButton";
import { COLLECTIONS_URL } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCollections } from "../slices/collectionsSlice";
import { Spinner } from "@nextui-org/react";
import { notify } from "../utils/notify";

const Home = () => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        `${COLLECTIONS_URL}?queryType=card&showOnHomepage=true`
      );
      dispatch(setCollections(response.data));
    } catch (error) {
      console.log("fetchCollections -> error", error);

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
    fetchCollections();
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
    <>
      {collections.data
        .filter((col) => col.showOnHomepage)
        .map((collection) => (
          <section className="mt-12 mx-0 sm:mx-4" key={collection.slug}>
            <div className="flex justify-between">
              <Text as="h3">{collection.name}</Text>
              <CustomButton
                to={`/collections/${collection.slug}`}
                as={Link}
                size="sm"
                radius="full"
                color="dark"
              >
                View More
              </CustomButton>
            </div>
            <div className="flex gap-x-4 overflow-auto p-4">
              {collection.products.slice(0, 6).map((product) => (
                <ProductCard key={product._id} data={product} />
              ))}
            </div>
          </section>
        ))}
    </>
  );
};

export default Home;
