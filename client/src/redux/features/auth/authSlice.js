import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../../services/authService.js';

const storedToken = localStorage.getItem('accessToken');
const storedUser = localStorage.getItem('authUser');

const parseStoredUser = () => {
  try {
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('authUser');
    return null;
  }
};

const persistSession = ({ token, user }) => {
  localStorage.setItem('accessToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('authUser');
  document.cookie = 'accessToken=; Max-Age=0; path=/; SameSite=Lax';
  document.cookie = 'refreshToken=; Max-Age=0; path=/; SameSite=Lax';
};

const getErrorMessage = (error) => (
  error.response?.data?.message || error.message || 'Authentication request failed'
);

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(payload);
    persistSession(data.data);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.register(payload);
    persistSession(data.data);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  clearSession();
  return true;
});

const initialState = {
  user: parseStoredUser(),
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      clearSession();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    hydrateAuth: (state) => {
      state.user = parseStoredUser();
      state.token = localStorage.getItem('accessToken');
      state.isAuthenticated = Boolean(state.token);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { logout, hydrateAuth, clearAuthError } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
