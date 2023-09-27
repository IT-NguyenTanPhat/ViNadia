import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';
import ITheme from '../../types/Theme';

export default function Auth(props: { isLogin: boolean }) {
  const { palette }: ITheme = useTheme();
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');
  const navigate = useNavigate();

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
      </Box>
    </Box>
  );
}
