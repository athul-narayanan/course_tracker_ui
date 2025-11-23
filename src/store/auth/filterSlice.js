import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  universityId: "",
  fieldId: "",
  specializationId: "",
  level: "",
  duration: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      Object.assign(state, action.payload);
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
