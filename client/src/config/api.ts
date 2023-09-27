import axios from 'axios';
import { setLogout } from '../app/auth/Auth.slice';
import { store } from '../state/store';

const baseURL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

function getCookie(key: string) {
  const b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

API.interceptors.request.use(
  (config) => {
    // Attach token to each request
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

API.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      // Access token was expired
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          // Get new access token by refresh token
          const response = await API.post('/auth/refresh-token', {
            token: getCookie('refresh_token'),
          });

          localStorage.setItem('token', response.data.token);
          API.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.token}`;

          return API(originalConfig);
        } catch (error2: any) {
          // Logout if failed
          store.dispatch(setLogout());
          return Promise.reject(error2);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
