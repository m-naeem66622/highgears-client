import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import collectionReducer from "./slices/collectionsSlice";
import productsReducer from "./slices/productsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  collections: collectionReducer,
  products: productsReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export default store;
