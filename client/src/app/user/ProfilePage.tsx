import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import UserWidget from '../widgets/UserWidget';
import { useMediaQuery, Box, Avatar, Skeleton } from '@mui/material';
import PostingWidget from '../widgets/PostingWidget';
import { RootState } from '../../state/store';
import { useDispatch, useSelector } from 'react-redux';
import NotFoundPage from '../error/NotFoundPage';
import { useParams } from 'react-router-dom';
import { showToast } from '../toast/Toast.slice';
import PostCard from '../../components/post/PostCard';
import { WidgetWrapper } from '../../components/Styled';
import API from '../../config/api';
import { setPosts, setUser } from '../App.slice';

export default function ProfilePage() {
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');
  const { user: authUser } = useSelector(
    (state: RootState) => state.AuthReducer
  );
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user, posts } = useSelector(
    (state: RootState) => state.AppReducer.profile
  );
  const [loading, setLoading] = useState(false);

  const getUserProfile = async () => {
    setLoading(true);
    try {
      const [response1, response2] = await Promise.all([
        API.get(`/users/${userId}`),
        API.get(`/users/${userId}/posts`),
      ]);

      dispatch(setUser({ user: response1.data.user }));
      dispatch(setPosts({ isFeed: false, posts: response2.data.posts }));
      setLoading(false);
    } catch (error) {
      dispatch(showToast({ message: 'Something went wrong' }));
    }
  };

  useEffect(() => {
    if (!user || !posts) {
      getUserProfile();
    }
  }, [user, posts]);

  if (!user && !loading) return <NotFoundPage />;

  return (
    <>
      <Navbar />
      <Box
        width={'100%'}
        display={isMobileScreen ? 'block' : 'flex'}
        p={'2rem 6%'}
        gap={'2rem'}
        justifyContent={'start'}
      >
        {/* Display skeleton when loading */}
        {loading || !user ? (
          <>
            {/* Column 1 */}
            <Box flexBasis={isMobileScreen ? undefined : '26%'}>
              <WidgetWrapper mb="2rem">
                <Box display="flex" mb="1rem">
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    sx={{ mr: '1rem' }}
                  >
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
              </WidgetWrapper>
            </Box>

            {/* Column 2 */}
            <Box
              flexBasis={isMobileScreen ? undefined : '42%'}
              mt={isMobileScreen ? '2rem' : undefined}
            >
              <WidgetWrapper mb="2rem">
                <Box display="flex" mb="1rem">
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    sx={{ mr: '1rem' }}
                  >
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
            </Box>
          </>
        ) : (
          <>
            {/* Column 1 */}
            <Box flexBasis={isMobileScreen ? undefined : '26%'}>
              <UserWidget user={user} />
            </Box>

            {/* Column 2 */}
            <Box
              flexBasis={isMobileScreen ? undefined : '42%'}
              mt={isMobileScreen ? '2rem' : undefined}
            >
              {authUser?._id === user._id && <PostingWidget />}

              {posts.length === 0 ? (
                <h3 style={{ color: 'gray' }}>
                  Hiện tại {user.name} chưa có bất kì bài viết nào.
                </h3>
              ) : (
                <>
                  {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                  ))}
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
