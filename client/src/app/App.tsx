import {
  CssBaseline,
  LinearProgress,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { themeSettings } from '../config/theme';
import { useEffect, useMemo } from 'react';
import AuthPage from './auth/AuthPage';
import HomePage from './home/HomePage';
import ProfilePage from './user/ProfilePage';
import NotFoundPage from './errors/NotFoundPage';
import { setLoading } from './App.slice';
import { RootState } from '../state/store';
import Toast from './toast/Toast';

function App() {
  const mode = useSelector((state: RootState) => state.AppReducer.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const loading = useSelector((state: RootState) => state.AppReducer.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    // Simulate an asynchronous task
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 500);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [dispatch]);

  return (
    <>
      {loading && <LinearProgress />}
      <Toast />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<AuthPage isLogin />} />
            <Route
              path="/auth/register"
              element={<AuthPage isLogin={false} />}
            />
            <Route path="/:userId" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
