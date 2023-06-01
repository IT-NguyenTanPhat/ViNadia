import { Box, Typography, useTheme } from '@mui/material';
import WidgetWrapper from '../../components/WidgetWrapper';
import Theme from '../../types/Theme';
import { useEffect, useState } from 'react';
import User from '../../types/User';
import FriendHeading from '../../components/FriendHeading';

export default function SuggestedFriendsWidget(props: { userId?: string }) {
  const { palette }: Theme = useTheme();
  const [friends, setFriends] = useState<User[]>([]);
  const { userId } = props;

  const getSuggestedFriends = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    await fetch(`${API_URL}/users/${userId}/suggested-friends`, {
      method: 'GET',
    })
      .then(async (response) => {
        if (!response.ok) throw await response.json();
        return response.json();
      })
      .then((data) => {
        setFriends(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSuggestedFriends();
  }, []);

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
          <FriendHeading key={friend._id} {...friend} />
        ))}
      </Box>
    </WidgetWrapper>
  );
}
