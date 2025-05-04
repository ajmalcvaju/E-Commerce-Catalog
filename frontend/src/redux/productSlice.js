import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    searchQuery: "",
  },
  reducers: {
    addProducts: (state, action) => {
      state.items = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { addProducts, setSearchQuery } = productSlice.actions;

export default productSlice.reducer;
