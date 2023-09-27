import { WidgetWrapper, FlexBox } from '../../components/Styled';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Box, Divider, Typography, useTheme } from '@mui/material';
import ITheme from '../../types/Theme';
import {
  EditOutlined,
  LinkedIn,
  LocationOnOutlined,
  ManageAccountsOutlined,
  Twitter,
  WorkOutlineOutlined,
} from '@mui/icons-material';
import IUser from '../../types/User';
import { styled } from '@mui/system';

const FlexCenterBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  mb: '0.5rem',
});

export default function UserWidget(props: { user: IUser; isOwner?: boolean }) {
  const { user, isOwner } = props;
  const navigate = useNavigate();
  const { palette }: ITheme = useTheme();

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
              {200} friends
            </Typography>
          </Box>
        </FlexBox>
        {isOwner && (
          <NavLink to={`#`}>
            <ManageAccountsOutlined
              sx={{
                color: palette.neutral.main,
                '&:hover': { opacity: 0.7 },
              }}
            />
          </NavLink>
        )}
      </FlexBox>

      <Divider />

      {/* SECOND ROW */}
      {(user.location || user.occupation) && (
        <>
          <Box p={'1rem 0'}>
            <FlexCenterBox>
              <LocationOnOutlined
                sx={{ color: palette.neutral.main }}
                fontSize="large"
              />
              <Typography color={palette.neutral.medium}>
                {user.location}
              </Typography>
            </FlexCenterBox>
            <FlexCenterBox>
              <WorkOutlineOutlined
                sx={{ color: palette.neutral.main }}
                fontSize="large"
              />
              <Typography color={palette.neutral.medium}>
                {user.occupation}
              </Typography>
            </FlexCenterBox>
          </Box>

          <Divider />
        </>
      )}

      {/* THIRD ROW */}
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
          {isOwner && <EditOutlined sx={{ color: palette.neutral.main }} />}
        </FlexBox>
      </Box>
    </WidgetWrapper>
  );
}
