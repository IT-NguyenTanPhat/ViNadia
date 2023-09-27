import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { FlexBox, WidgetWrapper } from '../../components/Styled';
import ITheme from '../../types/Theme';
import { useEffect, useState } from 'react';
import { IUserHeader } from '../../types/User';
import UserHeader from '../../components/UserHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import API from '../../config/api';
import { PersonAddOutlined } from '@mui/icons-material';

export default function SuggestedFriendsWidget() {
  const { palette }: ITheme = useTheme();
  const [friends, setFriends] = useState<IUserHeader[]>([]);
  const { user } = useSelector((state: RootState) => state.AuthReducer);

  const getSuggestedFriends = () => {
    API.get(`/users/${user?._id}/suggested-friends`).then((response) =>
      setFriends(response.data.friends)
    );
  };

  useEffect(() => {
    if (user) {
      getSuggestedFriends();
    }
  }, []);

  if (friends.length == 0 || !user) return null;

  const sendFriendRequest = (friendId: string) => {
    API.post(`/friendships/${user._id}`, { friendId }).then(() =>
      setFriends(friends.filter((friend) => friend._id !== friendId))
    );
  };

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight={500}
        sx={{ mb: '1.5rem' }}
      >
        People You May Know
      </Typography>
      <Box>
        {friends.map((friend) => (
          <FlexBox>
            <UserHeader key={friend._id} {...friend} />
            <IconButton
              onClick={() => sendFriendRequest(friend._id)}
              sx={{ bgcolor: palette.primary.light, p: '0.6rem' }}
            >
              <PersonAddOutlined sx={{ color: palette.primary.dark }} />
            </IconButton>
          </FlexBox>
        ))}
      </Box>
    </WidgetWrapper>
  );
}
