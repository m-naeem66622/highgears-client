import { createSlice } from "@reduxjs/toolkit";

const initialState = sessionStorage.getItem("productData")
  ? JSON.parse(sessionStorage.getItem("productData"))
  : { pagination: { currentPage: 1, limit: 20 }, data: [] };

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state = action.payload;
      state.pagination.currentPage = initialState.pagination.currentPage + 1;
      sessionStorage.setItem("productData", JSON.stringify(state));
      return state;
    },
    addProducts: (state, action) => {
      state.pagination = action.payload.pagination;
      state.pagination.currentPage += 1;
      state.data.push(...action.payload.data);
      sessionStorage.setItem("productData", JSON.stringify(state));
      return state;
    },
    clearProducts: () => {
      sessionStorage.removeItem("productData");
      return initialState;
    },
  },
});

export const { setProducts, addProducts, clearProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
