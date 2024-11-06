import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, createUser, signOut, checkAuth } from './authapi';
import Cookies from 'js-cookie';
import { updateUser } from '../user/userAPI';

const initialState = {
  loggedInUserToken: null, // this should only contain user identity => 'id'/'role'
  status: 'idle',
  error: null,
  userChecked: false
};

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (userData) => {
    const response = await createUser(userData);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);


export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async (loginInfo, { rejectWithValue }) => {
    try {
      console.log("this is logininfo",loginInfo)
      const response = await loginUser(loginInfo);
      console.log(response,"arehh wahh ho gaya na yeh request")
      // const token = response.data;
      // Cookies.set('token', token, { expires: 7 }); // The cookie will expire in 7 days
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      return rejectWithValue({ error: errorMessage });
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'user/checkAuth',
  async ({token}) => {
    try {
      const response = await checkAuth(token);
      console.log(response.data,"this is checkauth data")
      return response.data;
    } catch (error) {
      console.log(error,"this error is fromcheckauthasync");
    }
  }
);

export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async () => {
    const response = await signOut();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = null;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.userChecked = true;
      })
  },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const  selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;

// export const { } = authSlice.actions;

export default authSlice.reducer;