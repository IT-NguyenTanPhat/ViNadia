import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { WidgetWrapper, FlexBox } from '../../components/Styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useState } from 'react';
import ITheme from '../../types/Theme';
import Dropzone from 'react-dropzone';
import {
  AttachFileOutlined,
  DeleteOutlined,
  EditOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
  VideoLibraryOutlined,
} from '@mui/icons-material';
import { createPost } from '../App.slice';
import API from '../../config/api';
import { showToast } from '../toast/Toast.slice';

type Post = {
  text: string;
  image?: File;
};

export default function PostingWidget() {
  const { user } = useSelector((state: RootState) => state.AuthReducer);
  const [post, setPost] = useState<Post>({ text: '' });
  const [isImage, setIsImage] = useState(false);
  const { palette }: ITheme = useTheme();
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');
  const dispatch = useDispatch();

  if (!user) return null;

  const handlePost = () => {
    const formData = new FormData();
    formData.append('author', user._id);
    formData.append('description', post.text);

    if (post.image) formData.append('post', post.image);

    API.post(`/posts`, formData)
      .then((response) => {
        // Clear post editor
        setPost({ text: '' });
        setIsImage(false);
        dispatch(createPost({ post: response.data.post })); // Update newfeed
        dispatch(showToast({ type: 'success', message: 'Post created!' }));
      })
      .catch(() =>
        dispatch(
          showToast({ type: 'warning', message: 'Failed to create post!' })
        )
      );
  };

  return (
    <WidgetWrapper mb="2rem">
      <FlexBox>
        <Avatar src={user.avatar} />
        {/* Text editor */}
        <InputBase
          placeholder="What's on your mind..."
          value={post.text}
          onChange={(e) => setPost({ ...post, text: e.target.value })}
          sx={{
            width: '100%',
            bgcolor: palette.neutral.light,
            borderRadius: '2rem',
            ml: '0.75rem',
            p: '1rem 2rem',
          }}
        />
      </FlexBox>

      {/* Image editor */}
      {isImage && (
        <Box
          border={`1px solid ${palette.neutral.medium}`}
          borderRadius={'5px'}
          mt={'1rem'}
          p={'1rem'}
        >
          <Dropzone
            accept={{ 'image/*': [] }}
            multiple={false}
            onDrop={(acceptedFiles) =>
              setPost({ ...post, image: acceptedFiles[0] })
            }
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBox>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ '&:hover': { cursor: 'pointer' } }}
                >
                  <input {...getInputProps()} />
                  {!post.image ? (
                    <p>Browse / Drop your image here</p>
                  ) : (
                    <FlexBox>
                      <Typography>{post.image.name}</Typography>
                      <EditOutlined />
                    </FlexBox>
                  )}
                </Box>
                {/* Delete image button */}
                {post.image && (
                  <IconButton
                    onClick={() => setPost({ ...post, image: undefined })}
                    sx={{ width: '15%' }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBox>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: '1.25rem 0' }} />

      {/* Media selection */}
      <FlexBox>
        <FlexBox gap={'0.25rem'} onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: palette.neutral.mediumMain }} />
          <Typography
            color={isImage ? 'primary' : palette.neutral.mediumMain}
            sx={{
              '&:hover': { cursor: 'pointer', color: palette.neutral.medium },
            }}
          >
            Image
          </Typography>
        </FlexBox>
        {!isMobileScreen ? (
          <>
            <FlexBox gap="0.25rem">
              <VideoLibraryOutlined
                sx={{ color: palette.neutral.mediumMain }}
              />
              <Typography color={palette.neutral.mediumMain}>Video</Typography>
            </FlexBox>

            <FlexBox gap="0.25rem">
              <AttachFileOutlined sx={{ color: palette.neutral.mediumMain }} />
              <Typography color={palette.neutral.mediumMain}>
                Attachment
              </Typography>
            </FlexBox>

            <FlexBox gap="0.25rem">
              <MicOutlined sx={{ color: palette.neutral.mediumMain }} />
              <Typography color={palette.neutral.mediumMain}>Audio</Typography>
            </FlexBox>
          </>
        ) : (
          <MoreHorizOutlined />
        )}

        <Button
          disabled={!post.text && !post.image}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: '3rem',
          }}
        >
          POST
        </Button>
      </FlexBox>
    </WidgetWrapper>
  );
}
