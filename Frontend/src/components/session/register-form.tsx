'use client';
import userService from '@/api/users';
import LTInput from '@/components/common/input';
import { toSnakeCase } from '@/utils/helper';
import { Button } from '@nextui-org/react';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const MIN_USERNAME_LENGTH = 4;

function RegisterForm() {
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState(true);
  const router = useRouter();

  const checkUsernameAvailability = async (username: string) => {
    try {
      setIsCheckingAvailability(true);
      // Replace the URL with your backend endpoint for checking username availability
      await userService.checkUsernameAvailable({ username });
      setIsValidUsername(true);
    } catch (error) {
      console.error('Error checking username availability', error);
      setIsValidUsername(false);
      setIsCheckingAvailability(false);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Debounce the checkUsernameAvailability function using lodash debounce
  const debouncedCheckUsernameAvailability = debounce(
    checkUsernameAvailability,
    700
  );

  const handleUsernameChange = (event: any) => {
    formik.handleChange(event);
    const username = event.target.value;
    if (username.length < MIN_USERNAME_LENGTH) return;

    // Use the debounced function to check username availability
    debouncedCheckUsernameAvailability(username.toLowerCase());
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      username: Yup.string()
        .matches(
          /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9_.]{1,30}$/,
          `Username must be at least ${MIN_USERNAME_LENGTH} characters and can contain letters, numbers, underscores, and dots (but not consecutively or at the beginning/end).`
        )
        .required('Required')
        .min(
          MIN_USERNAME_LENGTH,
          `Must be at least ${MIN_USERNAME_LENGTH} characters`
        ),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .required('Required')
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          'Password must contain at least 8 characters, one digit, one lowercase letter, and one uppercase letter.'
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const transformData = toSnakeCase(values);
        await userService.registerUser(transformData);
        toast.success('Register successfully');
        formik.resetForm();
        formik.setSubmitting(false);
        router.push('/login');
      } catch (error: any) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data ||
          error.message ||
          error;
        ('An error occurred');
        console.error('Error registering user', error);
        if (typeof message === 'string') {
          toast.error(message);
        } else if (message instanceof Object) {
          Object.entries(message).forEach(([key, errorMessages]: any) => {
            if (Array.isArray(errorMessages)) {
              // Display individual error toasts for each message in the array
              errorMessages.forEach((errorMessage) => {
                console.log('errorMessage', errorMessage);
                toast.error(`${key?.toUpperCase()}: ${errorMessage}`);
              });
            } else {
              console.log('errorMessages', errorMessages);
              // Display a single error toast for non-array error messages
              toast.error(`${key}: ${errorMessages || errorMessages}`);
            }
          });
        }
      }
    },
  });

  const isValidName = formik.touched.name && formik.errors.name;
  const isValidUName = formik.touched.username && formik.errors.username;
  const isValidEmail = formik.touched.email && formik.errors.email;
  const isValidPassword = formik.touched.password && formik.errors.password;
  const isValidConfirmPassword =
    formik.touched.confirmPassword && formik.errors.confirmPassword;

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* Name Field */}
      <LTInput
        label="Name"
        type="text"
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
        className="w-full p-3 rounded"
        placeholder="Name"
        variant="bordered"
        isInvalid={isValidName ? true : undefined}
        errorMessage={isValidName ? formik.errors.name : undefined}
      />

      {/* Username Field */}
      <LTInput
        label="Username"
        type="text"
        name="username"
        onChange={handleUsernameChange}
        onBlur={formik.handleBlur}
        value={formik.values.username?.toLowerCase()}
        className="w-full p-3 rounded"
        placeholder="Username"
        variant="bordered"
        color={isCheckingAvailability ? 'success' : undefined}
        isInvalid={isValidUName ?? !isValidUsername ? true : undefined}
        errorMessage={
          isValidUName
            ? formik.errors.username
            : !isValidUsername
              ? `Invalid username.`
              : undefined
        }
      />

      {/* Email Field */}
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
        isInvalid={isValidEmail ? true : undefined}
        errorMessage={isValidEmail ? formik.errors.email : undefined}
      />

      {/* Password Field */}
      <LTInput
        label="Password"
        type="password"
        name="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        className="w-full p-3 rounded"
        placeholder="Password"
        variant="bordered"
        isInvalid={isValidPassword ? true : undefined}
        errorMessage={isValidPassword ? formik.errors.password : undefined}
      />

      {/* Confirm Password Field */}
      <LTInput
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.confirmPassword}
        className="w-full p-3 rounded"
        placeholder="Confirm Password"
        variant="bordered"
        isInvalid={isValidConfirmPassword ? true : undefined}
        errorMessage={
          isValidConfirmPassword ? formik.errors.confirmPassword : undefined
        }
      />

      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={formik.isSubmitting}
      >
        Register
      </Button>
    </form>
  );
}

export default RegisterForm;
