import { Typography, useTheme } from '@mui/material';
import { FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { object, ref, string } from 'yup';
import ITheme from '../../types/Theme';
import GenericForm from '../../components/GenericForm';
import { showToast } from '../toast/Toast.slice';
import API from '../../config/api';

interface Input {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = object().shape({
  name: string().required('Name is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required'),
  confirmPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
});

const initialValues: Input = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette }: ITheme = useTheme();

  const handleSubmit = async (
    values: Input,
    onSubmitProps: FormikHelpers<Input>
  ) => {
    API.post(`/auth/register`, values)
      .then(() => {
        onSubmitProps.resetForm();
        dispatch(
          showToast({
            title: 'Success',
            message: 'You can login right now!',
            type: 'success',
          })
        );
        navigate('/auth/login');
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
          { label: 'Name', name: 'name', colspan: 2 },
          { label: 'Email', name: 'email', colspan: 2 },
          { label: 'Password', name: 'password', type: 'password' },
          {
            label: 'Confirm Password',
            name: 'confirmPassword',
            type: 'password',
          },
        ]}
        submitButtonText="register"
      />
      <Typography
        onClick={() => {
          navigate('/auth/login');
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
        Already have an account? Login here.
      </Typography>
    </>
  );
}

export default RegisterForm;
