import {
  PersonAddOutlined,
  MoreVertOutlined,
  Block,
  PersonRemoveOutlined,
} from '@mui/icons-material';
import {
  IconButton,
  Select,
  InputBase,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { FlexBox } from '../Styled';
import UserHeader from '../UserHeader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IUser from '../../types/User';
import { RootState } from '../../state/store';
import ITheme from '../../types/Theme';
import API from '../../config/api';

export default function PostHeader(props: { postId: string; author: IUser }) {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.AuthReducer);
  const { author } = props;
  const { palette }: ITheme = useTheme();
  const [friendStatus, setFriendStatus] = useState<
    'requested' | 'not' | 'accepted'
  >('not');

  const getFriendStatus = useCallback(() => {
    if (!user) {
      setFriendStatus('not');
    } else if (user._id === author._id) {
      setFriendStatus('accepted');
    } else {
      API.get(`/friendships/${user?._id}/${author._id}`).then((response) =>
        setFriendStatus(response.data.status)
      );
    }
  }, [author._id, user]);

  const sendFriendRequest = () => {
    if (!user) return navigate('/auth/login');
    const request = friendStatus === 'not' ? API.post : API.delete;

    request(`/friendships/${user._id}`, { friendId: author._id }).then(
      (response) => setFriendStatus(response.data.status)
    );
  };

  useEffect(() => {
    getFriendStatus();
  }, []);

  return (
    <FlexBox>
      <UserHeader {...author} />

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
          {user?._id !== author._id && (
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
