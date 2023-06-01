import { Box, useMediaQuery } from '@mui/material';
import Navbar from '../../components/Navbar';
import UserWidget from '../widgets/UserWidget';
import NewFeed from './NewFeed';
import AdsWidget from '../widgets/AdsWidget';
import SuggestedFriendsWidget from '../widgets/SuggestedFriendsWidget';
import PostWidget from '../widgets/PostWidget';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import LoginSuggestionWidget from '../widgets/LoginSuggestionWidget';

export default function HomePage() {
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');
  const { user } = useSelector((state: RootState) => state.AuthReducer);

  return (
    <>
      <Navbar />
      <Box
        width={'100%'}
        display={isMobileScreen ? 'block' : 'flex'}
        p={'2rem 6%'}
        gap={'0.5rem'}
        justifyContent={'space-between'}
      >
        <Box flexBasis={isMobileScreen ? undefined : '26%'}>
          {user ? <UserWidget user={user} /> : <LoginSuggestionWidget />}
        </Box>
        <Box
          flexBasis={isMobileScreen ? undefined : '42%'}
          mt={isMobileScreen ? '2rem' : undefined}
        >
          <PostWidget />
          <NewFeed />
        </Box>
        {!isMobileScreen && (
          <Box flexBasis={'26%'}>
            <AdsWidget />
            <Box m="2rem 0" />
            <SuggestedFriendsWidget userId={user?._id} />
          </Box>
        )}
      </Box>
    </>
  );
}
