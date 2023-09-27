import { Box, useMediaQuery } from '@mui/material';
import Navbar from '../../components/Navbar';
import NewFeed from './NewFeed';
import AdsWidget from '../widgets/AdsWidget';
import SuggestedFriendsWidget from '../widgets/SuggestedFriendsWidget';
import PostingWidget from '../widgets/PostingWidget';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import LoginSuggestionWidget from '../widgets/LoginSuggestionWidget';
import SideBar from '../../components/SideBar';

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
        {/* Column 1 */}
        <Box flexBasis={isMobileScreen ? undefined : '26%'}>
          {user ? <SideBar /> : <LoginSuggestionWidget />}
        </Box>

        {/* Column 2 */}
        <Box
          flexBasis={isMobileScreen ? undefined : '42%'}
          mt={isMobileScreen ? '2rem' : undefined}
        >
          <PostingWidget />
          <NewFeed />
        </Box>

        {/* Column 3 */}
        {!isMobileScreen && (
          <Box flexBasis={'26%'}>
            <AdsWidget />
            <Box m="2rem 0" />
            <SuggestedFriendsWidget />
          </Box>
        )}
      </Box>
    </>
  );
}
