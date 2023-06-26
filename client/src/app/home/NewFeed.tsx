import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { setPosts } from '../App.slice';
import { useEffect, useState } from 'react';
import { showToast } from '../toast/Toast.slice';
import PostCard from '../../components/PostCard';

export default function NewFeed() {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.AppReducer.posts);
  const [loading, setLoading] = useState(true);

  const getFeedPosts = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    await fetch(`${API_URL}/posts`, { method: 'GET' })
      .then(async (response) => {
        if (!response.ok) throw await response.json();
        return response.json();
      })
      .then((data) => {
        dispatch(setPosts({ posts: data }));
        setLoading(false);
      })
      .catch(() => dispatch(showToast({ message: 'Something went wrong' })));
  };

  useEffect(() => {
    getFeedPosts();
  }, []);

  return (
    <>
      {posts.map((post) => (
        <PostCard loading={loading} key={post._id} post={post} />
      ))}
    </>
  );
}
