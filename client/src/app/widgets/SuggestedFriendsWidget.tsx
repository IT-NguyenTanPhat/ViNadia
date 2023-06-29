import { Box, Typography, useTheme } from '@mui/material';
import WidgetWrapper from '../../components/WidgetWrapper';
import ITheme from '../../types/Theme';
import { useEffect, useState } from 'react';
import { IUserHeading } from '../../types/User';
import UserHeading from '../../components/UserHeading';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

export default function SuggestedFriendsWidget(props: { userId?: string }) {
  const { palette }: ITheme = useTheme();
  const [friends, setFriends] = useState<IUserHeading[]>([]);
  const { userId } = props;
  const token = useSelector((state: RootState) => state.AuthReducer.token);

  const getSuggestedFriends = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    await fetch(`${API_URL}/users/${userId}/suggested-friends`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token,
      },
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

  if (friends.length == 0 || !userId) return null;

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
          <UserHeading key={friend._id} {...friend} />
        ))}
      </Box>
    </WidgetWrapper>
  );
}
