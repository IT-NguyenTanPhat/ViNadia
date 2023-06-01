import WidgetWrapper from '../../components/WidgetWrapper';
import FlexBox from '../../components/FlexBox';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Box, Divider, Typography, useTheme } from '@mui/material';
import Theme from '../../types/Theme';
import {
  EditOutlined,
  LinkedIn,
  LocationOnOutlined,
  ManageAccountsOutlined,
  Twitter,
  Visibility,
  WorkOutlineOutlined,
} from '@mui/icons-material';
import User from '../../types/User';

export default function UserWidget(props: { user: User }) {
  const { user } = props;
  const navigate = useNavigate();
  const { palette }: Theme = useTheme();

  if (!user) return null;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBox gap={'0.5rem'} pb={'1.1rem'}>
        <FlexBox gap={'1rem'}>
          <Avatar src={`${user.avatar}`} />
          <Box>
            <Typography
              variant="h4"
              color={palette.neutral.dark}
              fontWeight={500}
              sx={{
                '&:hover': { color: palette.primary.main, cursor: 'pointer' },
              }}
              onClick={() => navigate(`/${user._id}`)}
            >
              {user.name}
            </Typography>
            <Typography color={palette.neutral.medium}>
              {user.friends?.length} friends
            </Typography>
          </Box>
        </FlexBox>
        <NavLink to={`/${user._id}`}>
          <ManageAccountsOutlined
            sx={{
              color: palette.neutral.main,
              '&:hover': { opacity: 0.7 },
            }}
          />
        </NavLink>
      </FlexBox>

      <Divider />

      {/* SECOND ROW */}
      <Box p={'1rem 0'}>
        <Box display={'flex'} alignItems={'center'} gap={'1rem'} mb={'0.5rem'}>
          <LocationOnOutlined
            sx={{ color: palette.neutral.main }}
            fontSize="large"
          />
          <Typography color={palette.neutral.medium}>
            {user.location}
          </Typography>
        </Box>
        <FlexBox gap={'1rem'}>
          <WorkOutlineOutlined
            sx={{ color: palette.neutral.main }}
            fontSize="large"
          />
          <Typography color={palette.neutral.medium}>
            {user.occupation}
          </Typography>
        </FlexBox>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <FlexBox p={'1rem 0'}>
        <Typography color={palette.neutral.medium}>
          Who's viewed your profile
        </Typography>
        <FlexBox gap={'0.25rem'}>
          <Typography color={palette.neutral.main} fontWeight={500}>
            {user.viewedProfile}
          </Typography>
          <Visibility sx={{ color: palette.neutral.main }} />
        </FlexBox>
      </FlexBox>

      <Divider />

      {/* FOURTH ROW */}
      <Box p={'1rem 0'}>
        <Typography
          fontSize={'1rem'}
          color={palette.neutral.main}
          fontWeight={500}
          mb={'1rem'}
        >
          Social Profiles
        </Typography>
        <FlexBox gap="1rem" mb="0.5rem">
          <FlexBox gap="1rem">
            <Twitter />
            <Box>
              <Typography color={palette.neutral.main} fontWeight={500}>
                Twitter
              </Typography>
              <Typography color={palette.neutral.medium}>
                Social Network
              </Typography>
            </Box>
          </FlexBox>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBox>

        <FlexBox gap="1rem" mb="0.5rem">
          <FlexBox gap="1rem">
            <LinkedIn />
            <Box>
              <Typography color={palette.neutral.main} fontWeight={500}>
                Linkedin
              </Typography>
              <Typography color={palette.neutral.medium}>
                Network Platform
              </Typography>
            </Box>
          </FlexBox>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBox>
      </Box>
    </WidgetWrapper>
  );
}
