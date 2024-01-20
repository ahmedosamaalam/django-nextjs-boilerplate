'use client';

import userService from '@/api/users';
import LTInput from '@/components/common/input';
import { SUPPORTED_FILETYPES } from '@/utils/constants/CONSTANTS';
import { toCamelCase, toSnakeCase } from '@/utils/helper';
import { useProvideAuth } from '@/utils/hooks/auth';
import { IUserProfile } from '@/utils/types';
import { Button, Image } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

// Define the profile update form component
function ProfileForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();
  const auth = useProvideAuth();
  const uid = auth.user?.firebase_uid;
  const user: IUserProfile = toCamelCase({ ...auth.user });

  interface UserProfileForm {
    name: string;
    username: string;
    email: string;
    address?: string;
    phoneNumber?: string;
    state?: string;
    country?: string;
    photoUrl: string;
    [key: string]: string | undefined;
  }

  // Initial values for the form fields
  const initialValues: UserProfileForm = {
    name: user?.name,
    username: user?.username,
    email: user?.email,
    address: user?.address,
    phoneNumber: user?.phoneNumber || undefined,
    state: user?.state,
    country: user?.country,
    photoUrl: user?.photoUrl,
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    username: Yup.string().required('Required'),
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const presignedUrl = await userService.getPresignedUrl(uid, {
      content_type: selectedFile.type,
    });

    await userService.uploadFileToS3(
      presignedUrl.data.presigned_url,
      selectedFile,
      selectedFile.type
    );
  };

  // Formik hook for managing form state and submission
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: UserProfileForm) => {
      let photoUrl = user.photoUrl;
      try {
        if (selectedFile) {
          debugger;
          await handleUpload();
          photoUrl = uid;
        }
        const transformedData = toSnakeCase({ ...values, photoUrl });

        // Access only changed data using values and touched
        const changedData: Partial<UserProfileForm> = {};
        Object.keys(values).forEach((fieldName) => {
          if (values[fieldName] !== initialValues[fieldName]) {
            changedData[fieldName as keyof UserProfileForm] = values[fieldName];
          }
        });
        console.log('Changed data:', changedData);
        console.log('Submitting:', transformedData);

        await auth.updateUserData(user.id, transformedData);
        console.log('Updating user profile with:', transformedData);

        // Display a success message
        toast.success('Profile updated successfully');

        // Redirect to the profile page or any other desired page
        // router.push('/profile');
      } catch (error) {
        // Handle errors, display error messages, etc.
        console.error('Error updating user profile', error);
        toast.error('Error updating user profile');
      }
    },
  });

  // Render the profile update form
  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* Photo Field */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="profilePicture">
            <input
              accept={SUPPORTED_FILETYPES.join(',')}
              type="file"
              id="profilePicture"
              className="hidden"
              onChange={handleFileChange}
            />
            {user.photoUrl && !selectedFile ? (
              <Image
                src={user.photoUrl}
                alt="User Profile"
                width={240}
                height={240}
              />
            ) : (
              <Image
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : 'https://via.placeholder.com/150'
                }
                alt="User Default Profile"
                width={240}
                height={240}
              />
            )}
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
          isInvalid={formik.touched.name && !!formik.errors.name}
          errorMessage={
            (formik.touched.name && (formik.errors.name as string)) || undefined
          }
        />

        {/* username Field */}
        <LTInput
          label="Username"
          type="text"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          className="w-full p-3 rounded"
          placeholder="Username"
          variant="bordered"
          isInvalid={formik.touched.username && !!formik.errors.username}
          errorMessage={
            (formik.touched.username && (formik.errors.username as string)) ||
            undefined
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
          isInvalid={formik.touched.email && !!formik.errors.email}
          errorMessage={
            (formik.touched.email && (formik.errors.email as string)) ||
            undefined
          }
          isDisabled={true}
        />

        {/* Address Field */}
        <LTInput
          label="Address"
          type="text"
          name="address"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.address}
          className="w-full p-3 rounded"
          placeholder="Enter your address"
          variant="bordered"
          isInvalid={formik.touched.address && !!formik.errors.address}
          errorMessage={
            (formik.touched.address && (formik.errors.address as string)) ||
            undefined
          }
        />

        {/* Phone Field */}
        <LTInput
          label="Phone"
          type="tel"
          name="phoneNumber"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneNumber}
          className="w-full p-3 rounded"
          placeholder="Enter your phone number"
          variant="bordered"
          isInvalid={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
          errorMessage={
            (formik.touched.phoneNumber &&
              (formik.errors.phoneNumber as string)) ||
            undefined
          }
        />

        {/* State Field */}
        <LTInput
          label="State"
          type="text"
          name="state"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.state}
          className="w-full p-3 rounded"
          placeholder="Enter your state"
          variant="bordered"
          isInvalid={formik.touched.state && !!formik.errors.state}
          errorMessage={
            (formik.touched.state && (formik.errors.state as string)) ||
            undefined
          }
        />

        {/* Country Field */}
        <LTInput
          label="Country"
          type="text"
          name="country"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.country}
          className="w-full p-3 rounded"
          placeholder="Enter your country"
          variant="bordered"
          isInvalid={formik.touched.country && !!formik.errors.country}
          errorMessage={
            (formik.touched.country && (formik.errors.country as string)) ||
            undefined
          }
        />
      </div>

      {/* Submit Button */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={formik.isSubmitting}
        >
          Update Profile
        </Button>
        <Button color="danger" className="w-full" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;
