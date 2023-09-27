import { Typography, useTheme } from '@mui/material';
import { FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import ITheme from '../../types/Theme';
import { setLogin } from './Auth.slice';
import GenericForm from '../../components/GenericForm';
import API from '../../config/api';

interface Input {
  email: string;
  password: string;
}

const schema = object().shape({
  email: string().email('Invalid email').required('Required'),
  password: string().required('Required'),
});

const initialValues: Input = { email: '', password: '' };

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette }: ITheme = useTheme();

  const handleSubmit = async (
    values: Input,
    onSubmitProps: FormikHelpers<Input>
  ) => {
    API.post('/auth/login', values)
      .then((response) => {
        const { user, accessToken, refreshToken } = response.data;
        onSubmitProps.resetForm();

        // Save token
        localStorage.setItem('token', accessToken);
        document.cookie = `refresh_token=${refreshToken};max-age=2592000`;

        dispatch(setLogin({ user }));
        navigate('/');
      })
      .catch((err) => {
        const { message } = err.response ? err.response.data : err;
        onSubmitProps.setStatus({ error: message });
      });
  };
  
  return (
    <>
      <GenericForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={schema}
        fields={[
          { label: 'Email', name: 'email' },
          { label: 'Password', name: 'password', type: 'password' },
        ]}
        submitButtonText="Login"
      />
      <Typography
        onClick={() => {
          navigate('/auth/register');
        }}
        width={'fit-content'}
        sx={{
          textDecoration: 'underline',
          color: palette.primary.main,
          '&:hover': {
            cursor: 'pointer',
            color: palette.primary.light,
          },
        }}
      >
        Don't have an account? Sign up here.
      </Typography>
    </>
  );
}

export default LoginForm;
