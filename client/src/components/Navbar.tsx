import { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Person,
  LogoutOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import ITheme from '../types/Theme';
import { FlexBox } from './Styled';
import { setMode } from '../app/App.slice';
import { RootState } from '../state/store';
import { setLogout } from '../app/auth/Auth.slice';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.AuthReducer.user);
  const isMobileScreens = useMediaQuery('(max-width: 1000px)');
  const { palette }: ITheme = useTheme();

  return (
    <FlexBox padding="1rem 6%" bgcolor={palette.background.alt}>
      <FlexBox gap="1.75rem">
        {/* Logo */}
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate('/')}
          sx={{
            '&:hover': {
              color: palette.primary.light,
              cursor: 'pointer',
            },
          }}
        >
          ViNadia
        </Typography>

        {/* Search */}
        {!isMobileScreens && (
          <FlexBox
            bgcolor={palette.neutral.light}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBox>
        )}
      </FlexBox>

      {/* DESKTOP NAV */}
      {!isMobileScreens ? (
        <FlexBox gap="2rem">
          {/* Mode */}
          <IconButton onClick={() => dispatch(setMode())}>
            {palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ) : (
              <LightMode
                sx={{ color: palette.neutral.dark, fontSize: '25px' }}
              />
            )}
          </IconButton>

          {user && (
            <>
              <Message sx={{ fontSize: '25px' }} />
              <Notifications sx={{ fontSize: '25px' }} />
            </>
          )}

          <Help sx={{ fontSize: '25px' }} />

          {/* Selector */}
          {user ? (
            <Select
              value={user.name}
              autoWidth
              sx={{
                backgroundColor: palette.neutral.light,
                borderRadius: '0.5rem',
                p: '0.25rem 1rem',
              }}
              input={<InputBase />}
            >
              <MenuItem
                value={user.name}
                onClick={() => navigate(`/${user._id}`)}
              >
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Avatar
                    sx={{ width: 26, height: 26 }}
                    src={`${user.avatar}`}
                  />
                  <Typography>{user.name}</Typography>
                </Stack>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  navigate('/auth/login');
                }}
              >
                <LogoutOutlined sx={{ mr: '0.5rem' }} />
                Log Out
              </MenuItem>
            </Select>
          ) : (
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <NavLink to={'/auth/register'} style={{ textDecoration: 'none' }}>
                <Typography color="primary">Sign Up</Typography>
              </NavLink>
              <Typography>/</Typography>
              <NavLink to={'/auth/login'} style={{ textDecoration: 'none' }}>
                <Button variant="outlined">
                  <Typography color="primary">Login</Typography>
                </Button>
              </NavLink>
            </Stack>
          )}
        </FlexBox>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {isMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          bgcolor={palette.background.default}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            {/* Mode */}
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: '25px' }}
            >
              {palette.mode === 'dark' ? (
                <DarkMode sx={{ fontSize: '25px' }} />
              ) : (
                <LightMode
                  sx={{ color: palette.neutral.dark, fontSize: '25px' }}
                />
              )}
            </IconButton>

            {user && (
              <>
                <Message sx={{ fontSize: '25px' }} />
                <Notifications sx={{ fontSize: '25px' }} />
              </>
            )}
            <Help sx={{ fontSize: '25px' }} />

            {/* Selector */}
            {user ? (
              <FormControl variant="standard">
                <Select
                  value={user.name}
                  autoWidth
                  sx={{
                    backgroundColor: palette.neutral.light,
                    borderRadius: '0.25rem',
                    p: '0.25rem 1rem',
                    '& .MuiSelect-select:focus': {
                      backgroundColor: palette.neutral.light,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem
                    value={user.name}
                    onClick={() => navigate(`/${user._id}`)}
                  >
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        <Person />
                      </Avatar>
                      <Typography>{user.name}</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      dispatch(setLogout());
                      navigate('/auth/login');
                    }}
                  >
                    Log Out
                  </MenuItem>
                </Select>
              </FormControl>
            ) : (
              <NavLink to={'/auth/login'} style={{ textDecoration: 'none' }}>
                <Button variant="outlined">
                  <Typography color="primary">Login</Typography>
                </Button>
              </NavLink>
            )}
          </FlexBox>
        </Box>
      )}
    </FlexBox>
  );
};

export default Navbar;
