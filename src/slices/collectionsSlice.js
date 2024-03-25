import { createSlice } from "@reduxjs/toolkit";

const initialState = sessionStorage.getItem("collectionData")
  ? JSON.parse(sessionStorage.getItem("collectionData"))
  : { pagination: {}, data: [] };

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    setCollections: (state, action) => {
      // eslint-disable-next-line no-unused-vars
      state = action.payload;
      sessionStorage.setItem("collectionData", JSON.stringify(state));
      return state;
    },
    addCollection: (state, action) => {
      state.data.push(action.payload);
      sessionStorage.setItem("collectionData", JSON.stringify(state));
      return state;
    },
    clearCollections: () => {
      sessionStorage.removeItem("collectionData");
      return initialState;
    },
  },
});

export const { setCollections, addCollection, clearCollections } =
  collectionsSlice.actions;

export default collectionsSlice.reducer;
