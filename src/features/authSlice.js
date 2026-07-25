import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from 'react-hot-toast';

const initialState = {
  Authuser: JSON.parse(localStorage.getItem("user")) || null, 
  isUserSignup: false,
  staffuser: [],   // Defaulting to empty arrays prevents length check runtime crashes
  manageruser: [],
  adminuser: [],
  isUserLogin: false,
  token: localStorage.getItem("token") || null,
  isupdateProfile: false,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("auth/signup", credentials, { withCredentials: true });
      localStorage.setItem("user", JSON.stringify(response.data.savedUser)); 
      localStorage.setItem("token", response.data.savedUser.token); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("auth/login", credentials, { withCredentials: true });
      localStorage.setItem("user", JSON.stringify(response.data.user)); 
      localStorage.setItem("token", response.data.user.token); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authUser");
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (base64Image, { rejectWithValue }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        return rejectWithValue('User not authenticated. Please log in again.');
      }

      const response = await axiosInstance.put(
        'auth/updateProfile',
        { ProfilePic: base64Image },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = response.data;

      if (updatedData && updatedData.updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedData.updatedUser));
        return updatedData.updatedUser;
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

// ✅ Fixed axios.get parameters
export const staffUser = createAsyncThunk('auth/staffuser', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('auth/staffuser', { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get staff user');
  }
});

export const managerUser = createAsyncThunk('auth/manageruser', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('auth/manageruser', { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get manager user');
  }
});

export const adminUser = createAsyncThunk('auth/adminuser', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('auth/adminuser', { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get admin user');
  }
});

export const removeusers = createAsyncThunk("auth/removeuser", async (UserId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`auth/removeuser/${UserId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isUserSignup = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isUserSignup = false;
        state.Authuser = action.payload.savedUser; 
        state.token = action.payload.token; 
      })
      .addCase(signup.rejected, (state) => {
        state.isUserSignup = false;
      })
      .addCase(login.pending, (state) => {
        state.isUserLogin = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isUserLogin = false;
        state.Authuser = action.payload.user; 
        state.token = action.payload.token; 
      })
      .addCase(login.rejected, (state) => {
        state.isUserLogin = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.Authuser = null;
        state.token = null;
        toast.success("Successfully logged out!");
      })
      .addCase(updateProfile.pending, (state) => {
        state.isupdateProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isupdateProfile = false;
        state.Authuser = { ...state.Authuser, user: action.payload }; 
      })
      .addCase(staffUser.fulfilled, (state, action) => {
        // Adjust if response is wrapped e.g., action.payload.users
        state.staffuser = Array.isArray(action.payload) ? action.payload : action.payload.users || [];
      })
      .addCase(managerUser.fulfilled, (state, action) => {
        state.manageruser = Array.isArray(action.payload) ? action.payload : action.payload.users || [];
      })
      .addCase(adminUser.fulfilled, (state, action) => {
        state.adminuser = Array.isArray(action.payload) ? action.payload : action.payload.users || [];
      });
  },
});

export default authSlice.reducer;