import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import IPost from '../types/Post';
import WidgetWrapper from './WidgetWrapper';
import UserHeading from './UserHeading';
import ITheme from '../types/Theme';
import FlexBox from './FlexBox';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../app/toast/Toast.slice';
import { setPost } from '../app/App.slice';

export default function PostCard(props: { post: IPost; loading: boolean }) {
  const { _id, user, description, image, comments, likes } = props.post;
  const { token, user: authUser } = useSelector(
    (state: RootState) => state.AuthReducer
  );
  const isLiked = (() => {
    if (!authUser) return false;
    return likes.includes(authUser._id);
  })();
  const { palette }: ITheme = useTheme();
  const [isComment, setIsComment] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendLikeRequest = async () => {
    await fetch(`${API_URL}/posts/${_id}/like`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 403) return navigate('/auth/login');
          throw await response.json();
        }
        return response.json();
      })
      .then((data) => dispatch(setPost({ post: data })))
      .catch(() => dispatch(showToast({ message: 'Something went wrong' })));
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
          <UserHeading {...user} subtitle={user.location} />
          <Typography color={palette.neutral.main} sx={{ mt: '1rem' }}>
            {description}
          </Typography>
          
          {/* Image section */}
          {image && (
            <img
              src={`${API_URL}/${image}`}
              alt="post"
              width="100%"
              height="auto"
              style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
            />
          )}

          {/* Interactive section */}
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
                <Typography>{likes.length}</Typography>
              </FlexBox>

              <FlexBox gap="0.3rem">
                <IconButton onClick={() => setIsComment(!isComment)}>
                  {isComment ? (
                    <ChatBubbleOutlineOutlined
                      sx={{ color: palette.primary.main }}
                    />
                  ) : (
                    <ChatBubbleOutlineOutlined />
                  )}
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

          {/* Comments display */}
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
