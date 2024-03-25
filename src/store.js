import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import collectionReducer from "./slices/collectionsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    collections: collectionReducer,
  },
  devTools: true,
});

export default store;
