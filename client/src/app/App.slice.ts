import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import IPost from '../types/Post';

interface AppState {
  mode: 'light' | 'dark';
  loading: boolean;
  posts: IPost[];
}

const initialState: AppState = {
  mode: 'light',
  loading: true,
  posts: [],
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    // Add post to first position
    unShiftPost: (state, action) => {
      state.posts.unshift(action.payload.post);
    },
    setPost: (state, action) => {
      state.posts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
    },
  },
});

export const { setMode, setLoading, setPosts, unShiftPost, setPost } =
  slice.actions;

const persistConfig = { key: 'app', storage, version: 1 };
export default persistReducer(persistConfig, slice.reducer);
