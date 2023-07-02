import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import FlexBox from './FlexBox';
import { useNavigate } from 'react-router-dom';
import ITheme from '../types/Theme';
import {
  Block,
  MoreVertOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { IUserHeading } from '../types/User';
import { useEffect, useState } from 'react';
import { showToast } from '../app/toast/Toast.slice';

export default function UserHeading(props: IUserHeading) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
  const { _id, name, subtitle, avatar } = props;
  const { palette }: ITheme = useTheme();
  const { token, user } = useSelector((state: RootState) => state.AuthReducer);
  const [friendStatus, setFriendStatus] = useState<
    'requested' | 'not' | 'accepted'
  >('not');

  const getFriendStatus = async () => {
    if (!user) {
      setFriendStatus('not');
    } else if (user._id === _id) {
      setFriendStatus('accepted');
    } else {
      await fetch(`${API_URL}/friends/${user?._id}/${_id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 403) return navigate('/auth/login');
            throw await response.json();
          }
          return response.json();
        })
        .then((data) => {
          setFriendStatus(data.status);
        })
        .catch(() => dispatch(showToast({ message: 'Something went wrong' })));
    }
  };

  const sendFriendRequest = async () => {
    if (!user) return navigate('/auth/login');
    const method = friendStatus === 'not' ? 'POST' : 'DELETE';

    await fetch(`${API_URL}/friends/${user._id}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId: _id }),
    })
      .then(async (response) => {
        if (!response.ok) throw await response.json();
        return response.json();
      })
      .then((data) => setFriendStatus(data.status))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFriendStatus();
  }, []);

  return (
    <FlexBox>
      <FlexBox gap="1rem">
        <Avatar src={avatar} />
        <Box onClick={() => navigate(`/${_id}`)}>
          <Typography
            color={palette.neutral.main}
            variant="h5"
            fontWeight={500}
            sx={{
              '&:hover': {
                color: palette.primary.main,
                cursor: 'pointer',
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={palette.neutral.medium} fontSize={'0.75rem'}>
            {subtitle}
          </Typography>
        </Box>
      </FlexBox>

      {/* Menu */}
      {friendStatus === 'not' ? (
        <IconButton
          onClick={sendFriendRequest}
          sx={{ bgcolor: palette.primary.light, p: '0.6rem' }}
        >
          <PersonAddOutlined sx={{ color: palette.primary.dark }} />
        </IconButton>
      ) : friendStatus === 'accepted' ? (
        <Select input={<InputBase />} IconComponent={MoreVertOutlined}>
          <MenuItem>
            <Block sx={{ mr: '0.5rem' }} />
            Hide
          </MenuItem>
          {user?._id !== _id && (
            <MenuItem>
              <PersonRemoveOutlined sx={{ mr: '0.5rem' }} /> Unfriend
            </MenuItem>
          )}
        </Select>
      ) : (
        <IconButton
          onClick={sendFriendRequest}
          sx={{ bgcolor: palette.primary.light, p: '0.6rem' }}
        >
          <PersonRemoveOutlined sx={{ color: palette.primary.dark }} />
        </IconButton>
      )}
    </FlexBox>
  );
}
