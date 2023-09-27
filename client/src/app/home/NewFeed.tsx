import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { setPosts } from '../App.slice';
import { useEffect, useState } from 'react';
import { showToast } from '../toast/Toast.slice';
import PostCard from '../../components/post/PostCard';
import { Avatar, Box, Skeleton } from '@mui/material';
import { WidgetWrapper } from '../../components/Styled';
import API from '../../config/api';

export default function NewFeed() {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.AppReducer.feedPosts);
  const [loading, setLoading] = useState(false);

  const getFeedPosts = () => {
    setLoading(true);
    API.get(`/posts/feed`)
      .then((response) => {
        dispatch(setPosts({ isFeed: true, posts: response.data.posts }));
        setLoading(false);
      })
      .catch(() => dispatch(showToast({ message: 'Something went wrong!' })));
  };

  useEffect(() => {
    if (posts.length === 0) {
      getFeedPosts();
    }
  }, []);

  return (
    <>
      {loading ? (
        // Skeleton
        <WidgetWrapper mb="2rem">
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
          <Skeleton
            animation="wave"
            variant="rectangular"
            style={{ borderRadius: '10px', height: '15rem' }}
          />
        </WidgetWrapper>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </>
      )}
    </>
  );
}
