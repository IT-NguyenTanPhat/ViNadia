import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import UserWidget from '../widgets/UserWidget';
import IUser from '../../types/User';
import { useMediaQuery, Box } from '@mui/material';
import LoginSuggestionWidget from '../widgets/LoginSuggestionWidget';
import PostWidget from '../widgets/PostWidget';
import { RootState } from '../../state/store';
import { useDispatch, useSelector } from 'react-redux';
import NotFoundPage from '../errors/NotFoundPage';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '../toast/Toast.slice';
import PostCard from '../../components/PostCard';
import IPost from '../../types/Post';

export default function ProfilePage() {
  const [user, setUser] = useState<IUser>();
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');
  const isLoggedIn = Boolean(
    useSelector((state: RootState) => state.AuthReducer.user)
  );
  const { token } = useSelector((state: RootState) => state.AuthReducer);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const getUser = async () => {
    await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 403) return navigate('/auth/login');
          throw await response.json();
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch(() => dispatch(showToast({ message: 'Something went wrong' })));
  };

  const getUserPosts = async () => {
    await fetch(`${API_URL}/posts/${userId}/posts`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 403) return navigate('/auth/login');
          throw await response.json();
        }
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

  if (loading) return null;

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
