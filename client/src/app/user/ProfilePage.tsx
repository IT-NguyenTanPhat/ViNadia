import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import UserWidget from '../widgets/UserWidget';
import User from '../../types/User';
import { useMediaQuery, Box } from '@mui/material';
import LoginSuggestionWidget from '../widgets/LoginSuggestionWidget';
import PostWidget from '../widgets/PostWidget';
import { RootState } from '../../state/store';
import { useDispatch, useSelector } from 'react-redux';
import NotFoundPage from '../errors/NotFoundPage';
import { useParams } from 'react-router-dom';
import { showToast } from '../toast/Toast.slice';
import PostCard from '../../components/PostCard';
import Post from '../../types/Post';

export default function ProfilePage() {
  const [user, setUser] = useState<User>();
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');
  const isLoggedIn = Boolean(
    useSelector((state: RootState) => state.AuthReducer.user)
  );
  const { token } = useSelector((state: RootState) => state.AuthReducer);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw await response.json();
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  };

  const getUserPosts = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    await fetch(`${API_URL}/posts/${userId}/posts`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw await response.json();
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => dispatch(showToast({ message: 'Something went wrong' })));
  };

  useEffect(() => {
    getUser();
    getUserPosts();
  }, []);

  if (!user) return <NotFoundPage />;

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
        <Box flexBasis={isMobileScreen ? undefined : '26%'}>
          <UserWidget user={user} />
        </Box>
        <Box
          flexBasis={isMobileScreen ? undefined : '42%'}
          mt={isMobileScreen ? '2rem' : undefined}
        >
          <PostWidget />
          {posts.map((post) => (
            <PostCard loading={loading} post={post} />
          ))}
        </Box>
        {!isLoggedIn && (
          <Box flexBasis={'26%'}>
            <LoginSuggestionWidget />
          </Box>
        )}
      </Box>
    </>
  );
}
