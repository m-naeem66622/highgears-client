import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import AdvanceFilter from "../components/AdvanceFilter";
import Text from "../components/Text";
import { priceRange } from "../staticData";
import { Spinner } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { COLLECTIONS_URL } from "../constants";
import { notify } from "../utils/notify";
import axios from "axios";
import { addCollection } from "../slices/collectionsSlice";

const CollectionList = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const collections = useSelector((state) => state.collections);
  const [collection, setCollection] = useState({ pagination: {}, data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = React.useState({
    priceRange,
    sizes: [],
    colors: [],
  });

  const [products, setProducts] = React.useState([]);

  const handleFilterData = () => {
    const priceRangeChanged =
      filters.priceRange.join("") !== priceRange.join("");
    const sizesChanged = filters.sizes.length > 0;
    const colorsChanged = filters.colors.length > 0;

    if (priceRangeChanged || sizesChanged || colorsChanged) {
      setProducts(
        collection.products.filter((product) => {
          const priceRangeFilter =
            product.selling_price >= filters.priceRange[0] &&
            product.selling_price <= filters.priceRange[1];
          const sizesFilter =
            !filters.sizes.length ||
            filters.sizes.some((size) =>
              product.available_sizes.includes(size)
            );
          const colorsFilter =
            !filters.colors.length ||
            filters.colors.some((color) =>
              product.available_colors.includes(color)
            );

          return priceRangeFilter && sizesFilter && colorsFilter;
        })
      );
    } else {
      setProducts(collection.products);
    }
  };

  const fetchCollection = async () => {
    try {
      const response = await axios.get(`${COLLECTIONS_URL}/${slug}`);
      dispatch(addCollection(response.data.data));
      setCollection(response.data.data);
      setProducts(response.data.data.products);
    } catch (error) {
      console.log("fetchCollection -> error", error);

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
    const foundCollection = collections.data.find((c) => c.slug === slug);
    if (foundCollection) {
      setCollection(foundCollection);
      setProducts(foundCollection.products);
      setLoading(false);
    } else {
      fetchCollection();
    }
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
          {collection.name}
        </Text>
        <Text as="p" className="text-neutral-400 mt-6 sm:text-lg">
          {collection.description}
        </Text>
      </div>

      <AdvanceFilter
        filters={filters}
        setFilters={setFilters}
        handleOnClick={handleFilterData}
      />

      <div className="mt-8 flex flex-wrap gap-x-3 gap-y-6 justify-center">
        {products.map((product) => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>
    </div>
  );
};

export default CollectionList;
