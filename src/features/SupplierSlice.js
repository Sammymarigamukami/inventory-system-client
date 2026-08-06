import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from 'react-hot-toast';

const initialState = {
  getallSupplier: [], // ✅ Fix 1: Initialize as an empty array instead of null
  isallSupplier: false,
  isSupplieradd: false,
  isSupplierremove: false,
  searchdata: [],    // ✅ Best practice: Initialize arrays as []
  issearchdata: false,
  editedSupplier: null,
  iseditedSupplier: false,
  editedsupplier: null
};

export const CreateSupplier = createAsyncThunk(
  'supplier/createsupplier',
  async (Supplier, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("supplier/createsupplier", Supplier, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "supplier creation failed");
    }
  }
);

export const gettingallSupplier = createAsyncThunk(
  'supplier/getallsupplier',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('supplier/getallsupplier', { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Supplier retrieval failed");
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'supplier/deleteSupplier',
  async (supplierId, { rejectWithValue }) => {
    try {
      // ✅ Removed duplicate supplierId payload argument from axios.delete
      const response = await axiosInstance.delete(`supplier/${supplierId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Supplier remove failed");
    }
  }
);

export const SearchSupplier = createAsyncThunk(
  "supplier/searchSupplier",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`supplier/searchSupplier?query=${query}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Supplier search failed");
    }
  }
);

export const EditSupplier = createAsyncThunk(
  "supplier/updatesupplier",
  async ({ supplierId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `supplier/updatesupplier/${supplierId}`, 
        updatedData, 
        { withCredentials: true }
      );
      toast.success("Supplier updated successfully"); 
      return response.data; 
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to update supplier. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateSupplier.pending, (state) => {
        state.isSupplieradd = true;
      })
      .addCase(CreateSupplier.fulfilled, (state) => {
        state.isSupplieradd = false;
        toast.success("Supplier created successfully");
      })
      .addCase(CreateSupplier.rejected, (state) => {
        state.isSupplieradd = false;
        toast.error('Error creating Supplier');
      })
      
      .addCase(gettingallSupplier.pending, (state) => {
        state.isallSupplier = true;
      })
      .addCase(gettingallSupplier.fulfilled, (state, action) => {
        state.isallSupplier = false;
        
        // ✅ Fix 2: Extract the array safely regardless of how backend returns it
        const data = action.payload;
        if (Array.isArray(data)) {
          state.getallSupplier = data;
        } else if (data && Array.isArray(data.suppliers)) {
          state.getallSupplier = data.suppliers;
        } else if (data && Array.isArray(data.data)) {
          state.getallSupplier = data.data;
        } else {
          state.getallSupplier = [];
        }
      })
      .addCase(gettingallSupplier.rejected, (state) => {
        state.isallSupplier = false;
        state.getallSupplier = []; // ✅ Fallback to empty array on error
      })

      .addCase(deleteSupplier.pending, (state) => {
        state.isSupplierremove = true;
      })
      .addCase(deleteSupplier.fulfilled, (state) => {
        state.isSupplierremove = false;
      })
      .addCase(deleteSupplier.rejected, (state) => {
        state.isSupplierremove = false;
      })

      .addCase(SearchSupplier.fulfilled, (state, action) => {
        // ✅ Safely handle search data array extraction
        const data = action.payload;
        state.searchdata = Array.isArray(data) 
          ? data 
          : (data?.suppliers || data?.data || []);
      })

      .addCase(EditSupplier.fulfilled, (state, action) => {
        state.editedsupplier = action.payload;
      });
  },
});

export default supplierSlice.reducer;