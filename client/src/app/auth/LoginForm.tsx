import { Typography, useTheme } from '@mui/material';
import { FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import Theme from '../../types/Theme';
import { setLoading } from '../App.slice';
import { setLogin } from './Auth.slice';
import GenericForm from '../../components/GenericForm';

interface Input {
  email: string;
  password: string;
}

const schema = object().shape({
  email: string().email('Invalid email').required('Required'),
  password: string().required('Required'),
});

const initialValues: Input = {
  email: '',
  password: '',
};

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette }: Theme = useTheme();

  const handleSubmit = async (
    values: Input,
    onSubmitProps: FormikHelpers<Input>
  ) => {
    dispatch(setLoading(true));
    const API_URL: string = import.meta.env.VITE_API_URL;

    await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(async (response) => {
        if (!response.ok) throw await response.json();
        return response.json();
      })
      .then((data) => {
        onSubmitProps.resetForm();
        dispatch(setLogin({ user: data.user, token: data.token }));
        navigate('/');
      })
      .catch((err) => {
        onSubmitProps.setStatus({ error: err.message });
        console.error(err.message);
      })
      .finally(() => dispatch(setLoading(false)));
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
