import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import IPost from '../../types/Post';
import ITheme from '../../types/Theme';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { WidgetWrapper, FlexBox } from '../Styled';
import PostHeader from './PostHeader';
import { showToast } from '../../app/toast/Toast.slice';
import API from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { updatePost } from '../../app/App.slice';

export default function PostCard(props: { post: IPost }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { _id, author, description, image, comments, likes } = props.post;
  const { user } = useSelector((state: RootState) => state.AuthReducer);
  const { palette }: ITheme = useTheme();
  const [isComment, setIsComment] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendLikeRequest = () => {
    if (!user) return navigate('/auth/login');
    API.patch(`/posts/${_id}/like`, { userId: user._id })
      .then((response) => dispatch(updatePost({ post: response.data.post })))
      .catch(() =>
        dispatch(
          showToast({ type: 'warning', message: 'Failed. Please, try again!' })
        )
      );
  };

  return (
    <WidgetWrapper mb="2rem">
      <PostHeader postId={_id} author={author} />

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
          {/* Like */}
          <FlexBox gap="0.3rem">
            <IconButton onClick={sendLikeRequest}>
              {likes.includes(user?._id ?? '') ? (
                <FavoriteOutlined sx={{ color: palette.primary.main }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likes.length}</Typography>
          </FlexBox>

          {/* Comment */}
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

        {/* Share */}
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
    </WidgetWrapper>
  );
}
