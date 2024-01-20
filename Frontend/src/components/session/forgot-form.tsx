'use client';
import LTInput from '@/components/common/input';
import { useProvideAuth } from '@/utils/hooks/auth';
import { Button } from '@nextui-org/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function ForgotPasswordForm() {
  const auth = useProvideAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async ({ email }) => {
      // Handle password reset submission
      await auth.forgotPassword({ email });
    },
  });

  const isValid = formik.touched.email && formik.errors.email;
  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <LTInput
        label="Email"
        type="email"
        name="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        className="w-full p-3 rounded"
        placeholder="Enter your email"
        variant="bordered"
        isInvalid={isValid ? true : undefined}
        errorMessage={isValid ? formik.errors.email : undefined}
      />
      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={formik.isSubmitting}
      >
        Reset Password
      </Button>
    </form>
  );
}

export default ForgotPasswordForm;
