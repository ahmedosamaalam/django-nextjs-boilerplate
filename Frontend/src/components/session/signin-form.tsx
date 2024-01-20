'use client';
import LTInput from '@/components/common/input';
import { DASHBOARD_ROUTE } from '@/utils/constants/ROUTES';
import { useProvideAuth } from '@/utils/hooks/auth';
import { Button } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

function LoginForm() {
  const auth = useProvideAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      // Handle form submission
      const { identifier, password } = values;
      try {
        await auth.signIn({ identifier, password });
        toast.success('User signed in successfully');
        // Redirect to home page
        router.push(DASHBOARD_ROUTE);
      } catch (error) {
        console.log('------error', error);
        toast.error('User signed in failed');
        // Handle errors (e.g., user not found, wrong password)
      }
    },
  });
  const isValidIdentifier =
    formik.touched.identifier && formik.errors.identifier;
  const isValidPassword = formik.touched.password && formik.errors.password;

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <LTInput
        label="Email OR Username"
        type="text"
        name="identifier"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.identifier}
        className="w-full p-3  rounded"
        placeholder="Email OR Username"
        variant="bordered"
        isInvalid={isValidIdentifier ? true : undefined}
        errorMessage={isValidIdentifier ? formik.errors.identifier : undefined}
      />
      <LTInput
        label="Password"
        type="password"
        name="password"
        variant="bordered"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        className="w-full p-3  rounded"
        placeholder="Password"
        isInvalid={isValidPassword ? true : undefined}
        errorMessage={isValidPassword ? formik.errors.password : undefined}
      />
      <Button
        type="submit"
        color="primary"
        className="p-3 w-full"
        isLoading={formik.isSubmitting}
      >
        Sign in
      </Button>
    </form>
  );
}

export default LoginForm;
