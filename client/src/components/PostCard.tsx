import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import Post from '../types/Post';
import WidgetWrapper from './WidgetWrapper';
import FriendHeading from './FriendHeading';
import Theme from '../types/Theme';
import FlexBox from './FlexBox';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { useState } from 'react';

export default function PostCard(props: { post: Post; loading: boolean }) {
  const { user, description, image, comments } = props.post;
  const isLiked = true;
  const likeCount = 10;
  const { palette }: Theme = useTheme();
  const [isComment, setIsComment] = useState(false);

  const sendLikeRequest = () => {
    return;
  };

  return (
    <WidgetWrapper mb="2rem">
      {props.loading ? (
        <>
          <Box display="flex" mb="1rem">
            <Skeleton animation="wave" variant="circular" sx={{ mr: '1rem' }}>
              <Avatar />
            </Skeleton>
            <Box width="100%">
              <Skeleton
                animation="wave"
                width="50%"
                height={15}
                sx={{ mb: '0.25rem' }}
              />
              <Skeleton animation="wave" width="30%" height={15} />
            </Box>
          </Box>
          <Skeleton animation="wave" variant="rectangular" height="12rem" />
        </>
      ) : (
        <>
          <FriendHeading {...user} subtitle={user.location} />
          <Typography color={palette.neutral.main} sx={{ mt: '1rem' }}>
            {description}
          </Typography>
          {image && (
            <img
              src={image}
              alt="post"
              width="100%"
              height="auto"
              style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
            />
          )}

          <FlexBox mt="0.25rem">
            <FlexBox gap="1rem">
              <FlexBox gap="0.3rem">
                <IconButton onClick={sendLikeRequest}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: palette.primary.main }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{likeCount}</Typography>
              </FlexBox>

              <FlexBox gap="0.3rem">
                <IconButton onClick={() => setIsComment(!isComment)}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{comments.length}</Typography>
              </FlexBox>
            </FlexBox>

            <FlexBox gap="0.3rem">
              <IconButton>
                <ShareOutlined />
              </IconButton>
              <Typography>0</Typography>
            </FlexBox>
          </FlexBox>

          {isComment && (
            <Box mt="0.5rem">
              {comments.map((comment, i) => (
                <Box key={i}>
                  <Divider />
                  <Typography
                    sx={{
                      color: palette.neutral.main,
                      m: '0.5rem 0',
                      pl: '1rem',
                    }}
                  >
                    {comment}
                  </Typography>
                </Box>
              ))}
              <Divider />
            </Box>
          )}
        </>
      )}
    </WidgetWrapper>
  );
}
