import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface ToastState {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  isOpen?: boolean;
  duration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'center' | 'right' | 'left';
  };
}

const initialState: ToastState = {
  message: '',
  isOpen: false,
  duration: 3000,
  position: {
    vertical: 'bottom',
    horizontal: 'left',
  },
};

const slice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: { payload: ToastState; type: string }) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.duration = action.payload.duration ?? initialState.duration;
      state.position = action.payload.position ?? initialState.position;
    },
    closeToast: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showToast, closeToast } = slice.actions;

const persistConfig = { key: 'toast', storage, version: 1 };
export default persistReducer(persistConfig, slice.reducer);
