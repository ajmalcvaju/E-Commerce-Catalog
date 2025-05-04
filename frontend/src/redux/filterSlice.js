import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryFilter: "All",
  maxPrice: 12000,
  sortOption: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    resetFilter: () => initialState,
  },
});

export const { setCategoryFilter, setMaxPrice, setSortOption, resetFilter } =
  filterSlice.actions;
export default filterSlice.reducer;
