import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  universities: [],
  fields: [],
  specializations: {},
  loaded: false,
};

const lookupsSlice = createSlice({
  name: "lookups",
  initialState,
  reducers: {
    setUniversities: (state, action) => {
      state.universities = action.payload;
    },
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setSpecializations: (state, action) => {
      const { fieldId, list } = action.payload;
    if (typeof fieldId !== "number") return;
      state.specializations[fieldId] = list;
    },
    setLookupsLoaded: (state, action) => {
      state.loaded = action.payload;
    },
  },
});

export const {
  setUniversities,
  setFields,
  setSpecializations,
  setLookupsLoaded,
} = lookupsSlice.actions;

export default lookupsSlice.reducer;
