import {
  Snackbar,
  Alert,
  SnackbarContent,
  IconButton,
  AlertTitle,
} from '@mui/material';
import { RootState } from '../../state/store';
import { useDispatch, useSelector } from 'react-redux';
import { closeToast } from './Toast.slice';
import { Close } from '@mui/icons-material';

export default function Toast() {
  const { isOpen, message, title, duration, type, position } = useSelector(
    (state: RootState) => state.ToastReducer
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeToast());
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={position}
    >
      {type ? (
        <Alert onClose={handleClose} severity={type}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>{title}</AlertTitle>
          {message}
        </Alert>
      ) : (
        <SnackbarContent
          message={message}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          }
        />
      )}
    </Snackbar>
  );
}
