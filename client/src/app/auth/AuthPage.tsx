import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';
import ITheme from '../../types/Theme';
import { Google } from '@mui/icons-material';
import { useGoogleLogin } from '@react-oauth/google';
import API from '../../config/api';
import { useDispatch } from 'react-redux';
import { showToast } from '../toast/Toast.slice';
import { setLogin } from './Auth.slice';

export default function Auth(props: { isLogin: boolean }) {
  const { palette }: ITheme = useTheme();
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGGLogin = useGoogleLogin({
    onSuccess: async (authResult) => {
      try {
        const response = await API.get(`/auth/google?code=${authResult.code}`);
        const { user, accessToken, refreshToken } = response.data;

        // Save token
        localStorage.setItem('token', accessToken);
        document.cookie = `refresh_token=${refreshToken};max-age=2592000`;

        dispatch(setLogin({ user }));
        navigate('/');
      } catch (e) {
        dispatch(
          showToast({
            message: 'Something went wrong. Please, try again later.',
            type: 'error',
          })
        );
      }
    },
    onError: () => {
      dispatch(
        showToast({
          message: 'Something went wrong. Please, try again later.',
          type: 'error',
        })
      );
    },
    flow: 'auth-code',
  });

  return (
    <Box>
      <Box
        width="100%"
        textAlign="center"
        padding="1rem 6%"
        bgcolor={palette.background.alt}
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          onClick={() => navigate('/')}
        >
          ViNadia
        </Typography>
      </Box>

      <Box
        width={isMobileScreen ? '93%' : '50%'}
        p={'2rem'}
        m="2rem auto"
        borderRadius={'1.5rem'}
        bgcolor={palette.background.alt}
      >
        <Typography
          textAlign={'center'}
          fontWeight={500}
          variant="h5"
          sx={{ mb: '1.5rem' }}
        >
          Welcome to ViNadia, the Social Media for VietNamese.
        </Typography>
        {/* Form */}
        {props.isLogin ? <LoginForm /> : <RegisterForm />}
        <Button
          onClick={handleGGLogin}
          type="submit"
          sx={{
            mt: '25px',
            p: '10px',
            width: '100%',
            border: '2px solid #DB4437',
            backgroundColor: '#DB4437',
            color: 'white',
            '&:hover': { color: '#DB4437', backgroundColor: 'white' },
          }}
        >
          <Google sx={{ mr: '10px' }} />
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
}
