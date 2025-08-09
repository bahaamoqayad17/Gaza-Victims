import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Case } from "../api/apiSlice";

interface CasesState {
  cases: Case[];
  selectedCase: Case | null;
  filters: {
    status?: string;
    gender?: string;
    location?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCases: number;
    limit: number;
  };
  isLoading: boolean;
}

const initialState: CasesState = {
  cases: [],
  selectedCase: null,
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCases: 0,
    limit: 10,
  },
  isLoading: false,
};

const casesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    setCases: (state, action: PayloadAction<Case[]>) => {
      state.cases = action.payload;
    },
    addCase: (state, action: PayloadAction<Case>) => {
      state.cases.unshift(action.payload);
    },
    updateCase: (state, action: PayloadAction<Case>) => {
      const index = state.cases.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.cases[index] = action.payload;
      }
    },
    removeCase: (state, action: PayloadAction<string>) => {
      state.cases = state.cases.filter((c) => c._id !== action.payload);
    },
    setSelectedCase: (state, action: PayloadAction<Case | null>) => {
      state.selectedCase = action.payload;
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (
      state,
      action: PayloadAction<typeof initialState.pagination>
    ) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCases,
  addCase,
  updateCase,
  removeCase,
  setSelectedCase,
  setFilters,
  clearFilters,
  setPagination,
  setLoading,
} = casesSlice.actions;

export default casesSlice.reducer;
