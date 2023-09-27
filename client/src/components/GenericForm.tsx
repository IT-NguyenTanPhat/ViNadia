import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import ITheme from '../types/Theme';

interface Props<T extends FormikValues> {
  onSubmit: (values: T, onSubmitProps: FormikHelpers<T>) => Promise<void>;
  initialValues: T;
  validationSchema?: any;
  fields: { label: string; name: string; colspan?: number; type?: string }[];
  submitButtonText?: string;
}

function GenericForm<T extends FormikValues>({ ...props }: Props<T>) {
  const isMobileScreen = useMediaQuery('(max-width: 600px)');
  const { palette }: ITheme = useTheme();

  return (
    <Formik
      onSubmit={props.onSubmit}
      initialValues={props.initialValues}
      validationSchema={props.validationSchema}
    >
      {({
        values,
        errors,
        touched,
        status,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          {/* FIELDS */}
          <Box
            display={'grid'}
            gap={'30px'}
            gridTemplateColumns={'repeat(4, minmax(0, 1fr))'}
            sx={{
              '& > div': {
                gridColumn: isMobileScreen ? 'span 4' : undefined,
              },
            }}
          >
            {props.fields.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                type={field.type ?? 'text'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[field.name]}
                name={field.name}
                error={
                  Boolean(touched[field.name]) && Boolean(errors[field.name])
                }
                helperText={<>{touched[field.name] && errors[field.name]}</>}
                sx={{ gridColumn: `span ${field.colspan ?? 4}` }}
              />
            ))}
          </Box>

          {/* ERRORS */}
          {status && status.error && (
            <Typography color="error" variant="h6" mt={'24px'}>
              {status.error}
            </Typography>
          )}

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
            >
              {props.submitButtonText ?? 'Submit'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

export default GenericForm;
