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
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { IUserHeading } from '../types/User';

export default function UserHeading(props: IUserHeading) {
  const navigate = useNavigate();
  const { _id, name, subtitle, avatar } = props;
  const { palette }: ITheme = useTheme();
  const { token, user } = useSelector((state: RootState) => state.AuthReducer);
  const isFriend = true;

  const sendFriendRequest = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    await fetch(`${API_URL}/users/${user?._id}/${_id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw await response.json();
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

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
      {!isFriend ? (
        <IconButton
          onClick={sendFriendRequest}
          sx={{ bgcolor: palette.primary.light, p: '0.6rem' }}
        >
          <PersonAddOutlined sx={{ color: palette.primary.dark }} />
        </IconButton>
      ) : (
        <Select input={<InputBase />} IconComponent={MoreVertOutlined}>
          <MenuItem>
            <Block sx={{ mr: '0.5rem' }} />
            Hide
          </MenuItem>
          <MenuItem>
            <PersonRemoveOutlined sx={{ mr: '0.5rem' }} /> Unfriend
          </MenuItem>
        </Select>
      )}
    </FlexBox>
  );
}
