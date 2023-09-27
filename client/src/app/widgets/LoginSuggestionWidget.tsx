import { Box, Button, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { WidgetWrapper } from '../../components/Styled';

export default function LoginSuggestionWidget() {
  return (
    <WidgetWrapper textAlign="center">
      <Typography variant="h5" fontWeight="bold">
        Please, login to fully explore ViNadia's features.
      </Typography>

      <Box mt="2rem">
        <NavLink to="/auth/register">
          <Button variant="outlined" sx={{ mr: '1rem' }}>
            Sign Up
          </Button>
        </NavLink>
        <NavLink to="/auth/login">
          <Button variant="contained">
            <Typography color="white">Login</Typography>
          </Button>
        </NavLink>
      </Box>
    </WidgetWrapper>
  );
}
