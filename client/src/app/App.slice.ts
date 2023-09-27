import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import IPost from '../types/Post';
import IUser from '../types/User';

interface AppState {
  mode: 'light' | 'dark';
  feedPosts: IPost[];
  profile: {
    user?: IUser;
    posts: IPost[];
  };
}

const initialState: AppState = {
  mode: 'light',
  feedPosts: [],
  profile: {
    posts: [],
  },
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setUser: (state, action) => {
      state.profile.user = action.payload.user;
    },
    setPosts: (state, action) => {
      if (action.payload.isFeed) state.feedPosts = action.payload.posts;
      else state.profile.posts = action.payload.posts;
    },
    updatePost: (state, action) => {
      state.feedPosts = state.feedPosts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.profile.posts = state.profile.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
    },
    // Add post to first position
    createPost: (state, action) => {
      state.feedPosts.unshift(action.payload.post);
    },
  },
});

export const { setMode, setUser, setPosts, updatePost, createPost } =
  slice.actions;

const persistConfig = {
  key: 'app',
  storage,
  version: 1,
  blacklist: ['posts', 'profile'],
};
export default persistReducer(persistConfig, slice.reducer);
