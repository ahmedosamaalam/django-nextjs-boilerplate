import { GET, PATCH, POST, SIMPLE_POST } from '@/lib/axios';
import toast from 'react-hot-toast';

class UserService {
  getUserProfileById(params: Object) {
    return GET('profile/', params);
  }

  getEmailByUsername(payload: Object) {
    return SIMPLE_POST('check-email/', payload);
  }

  checkUsernameAvailable(payload: Object) {
    return SIMPLE_POST('check-username/', payload);
  }

  registerUser(payload: Object) {
    return POST('register/', payload);
  }

  getAllProfiles() {
    return GET('profile/');
  }

  getProfileById(id: string) {
    return GET(`profile/${id}`);
  }

  createProfile(payload: object) {
    return POST('profile/', payload);
  }

  updateProfile(id: string, payload: object) {
    return PATCH(`profile/${id}/`, payload);
  }

  getPresignedUrl(firebase_uid: string, payload: object) {
    return POST(`files/create_presigned_url/${firebase_uid}/`, payload);
  }

  async uploadFileToS3(url: string, file: File, contentType: string) {
    fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.success('File uploaded successfully!');
          // alert('File uploaded successfully!');
        } else {
          toast.error(`Error uploading file. Please try again.`);
        }
      })
      .catch((error) => {
        toast.error(`Error uploading file. Please try again.`);
        console.error('Error uploading file:', error);
        throw new Error(error);
      });
  }
  // destroyProfile(id: string) {
  //   return DELETE(`profile/${id}`);
  // }
}

const userService = new UserService();
export default userService;
