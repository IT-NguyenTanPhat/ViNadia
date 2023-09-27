import {
  CssBaseline,
  LinearProgress,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { themeSettings } from '../config/theme';
import { Suspense, useMemo } from 'react';
import { RootState } from '../state/store';
import Toast from './toast/Toast';
import React from 'react';

const HomePage = React.lazy(() => import('./home/HomePage'));
const AuthPage = React.lazy(() => import('./auth/AuthPage'));
const ProfilePage = React.lazy(() => import('./user/ProfilePage'));
const NotFoundPage = React.lazy(() => import('./error/NotFoundPage'));

function App() {
  const mode = useSelector((state: RootState) => state.AppReducer.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const { user } = useSelector((state: RootState) => state.AuthReducer);

  return (
    <>
      <Toast />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<LinearProgress />}>
            <Routes>
              <Route index path="/" element={<HomePage />} />
              <Route path="/auth/login" element={<AuthPage isLogin />} />
              <Route
                path="/auth/register"
                element={<AuthPage isLogin={false} />}
              />
              <Route
                path="/:userId"
                element={user ? <ProfilePage /> : <Navigate to="/auth/login" />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
