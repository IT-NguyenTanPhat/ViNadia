import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import User from '../../types/User';

interface AuthState {
  token?: string;
  user?: User
}

const initialState: AuthState = {};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.token = undefined;
      state.user = undefined;
    },
  },
});

export const { setLogin, setLogout } = slice.actions;

const persistConfig = { key: 'auth', storage, version: 1 };
export default persistReducer(persistConfig, slice.reducer);
