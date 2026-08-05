import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from 'react-hot-toast';

// Safe helper function to parse localStorage items without throwing
const getSafeLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") return null;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return null;
  }
};

const initialState = {
  Authuser: getSafeLocalStorage("user"), 
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
      
      // Backend returns { message, user: { id, name, email, role, ProfilePic, token } }
      const user = response.data.user;
      const token = user?.token;

      if (user) localStorage.setItem("user", JSON.stringify(user)); 
      if (token) localStorage.setItem("token", token); 

      return response.data;
    } catch (error) {
      // Returns backend payload e.g. { error: "User already exists" }
      return rejectWithValue(error.response?.data || { error: "Signup failed" });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("auth/login", credentials, { withCredentials: true });
      
      const user = response.data.user;
      const token = user?.token;

      if (user) localStorage.setItem("user", JSON.stringify(user)); 
      if (token) localStorage.setItem("token", token); 

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Login failed" });
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
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Logout failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (base64Image, { rejectWithValue }) => {
    try {
      const storedUser = getSafeLocalStorage('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        return rejectWithValue({ error: 'User not authenticated. Please log in again.' });
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
        error.response?.data || { error: 'Failed to update profile' }
      );
    }
  }
);

export const staffUser = createAsyncThunk('auth/staffuser', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('auth/staffuser', { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to get staff user' });
  }
});

export const managerUser = createAsyncThunk('auth/manageruser', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('auth/manageruser', { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to get manager user' });
  }
});

export const adminUser = createAsyncThunk('auth/adminuser', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('auth/adminuser', { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to get admin user' });
  }
});

export const removeusers = createAsyncThunk("auth/removeuser", async (UserId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`auth/removeuser/${UserId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Failed to delete user' });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Signup */
      .addCase(signup.pending, (state) => {
        state.isUserSignup = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isUserSignup = false;
        state.Authuser = action.payload.user; 
        state.token = action.payload.user?.token || state.token; 
      })
      .addCase(signup.rejected, (state) => {
        state.isUserSignup = false;
      })
      /* Login */
      .addCase(login.pending, (state) => {
        state.isUserLogin = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isUserLogin = false;
        state.Authuser = action.payload.user; 
        state.token = action.payload.user?.token || state.token; 
      })
      .addCase(login.rejected, (state) => {
        state.isUserLogin = false;
      })
      /* Logout */
      .addCase(logout.fulfilled, (state) => {
        state.Authuser = null;
        state.token = null;
        toast.success("Successfully logged out!");
      })
      /* Profile Update */
      .addCase(updateProfile.pending, (state) => {
        state.isupdateProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isupdateProfile = false;
        state.Authuser = action.payload; 
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isupdateProfile = false;
      })
      /* User Lists Fetch */
      .addCase(staffUser.fulfilled, (state, action) => {
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