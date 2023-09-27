import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ITheme from '../types/Theme';
import { IUserHeader } from '../types/User';
import { FlexBox } from './Styled';

export default function UserHeader(props: IUserHeader) {
  const navigate = useNavigate();
  const { _id, name, location, avatar } = props;
  const { palette }: ITheme = useTheme();

  return (
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
          {location}
        </Typography>
      </Box>
    </FlexBox>
  );
}
