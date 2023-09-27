import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Divider, Typography, useTheme } from '@mui/material';
import {
  Chat,
  LocationOnOutlined,
  People,
  WorkOutlineOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import ITheme from '../types/Theme';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { WidgetWrapper, FlexBox } from './Styled';

const FlexCenterBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  mb: '0.5rem',
});

export default function SideBar() {
  const navigate = useNavigate();
  const { palette }: ITheme = useTheme();
  const { user } = useSelector((state: RootState) => state.AuthReducer);

  if (!user) return null;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBox
        gap={'0.5rem'}
        p="10px"
        sx={{
          '&:hover': { bgcolor: palette.primary.light },
          cursor: 'pointer',
          borderRadius: '10px',
        }}
        onClick={() => navigate(`/${user._id}`)}
      >
        <FlexBox gap={'1rem'}>
          <Avatar src={`${user.avatar}`} />
          <Box>
            <Typography
              variant="h4"
              color={palette.neutral.dark}
              fontWeight={500}
            >
              {user.name}
            </Typography>
          </Box>
        </FlexBox>
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
      <Box p={'0.5rem 0'}>
        <FlexBox
          gap="1rem"
          p="10px"
          sx={{
            '&:hover': { bgcolor: palette.primary.light },
            cursor: 'pointer',
            borderRadius: '10px',
          }}
        >
          <FlexBox gap="1rem">
            <People />
            <Typography color={palette.neutral.main} fontWeight={500}>
              Friends
            </Typography>
          </FlexBox>
        </FlexBox>

        <FlexBox
          gap="1rem"
          p="10px"
          sx={{
            '&:hover': { bgcolor: palette.primary.light },
            cursor: 'pointer',
            borderRadius: '10px',
          }}
        >
          <FlexBox gap="1rem">
            <Chat />
            <Typography color={palette.neutral.main} fontWeight={500}>
              Chat Box
            </Typography>
          </FlexBox>
        </FlexBox>
      </Box>
    </WidgetWrapper>
  );
}
