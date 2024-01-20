export interface IUserProfile {
  uid: string;
  id: string;
  firebase_uid: string;
  name: string;
  email: string;
  username: string;
  photoUrl: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  phoneNumber: string | null;
  address?: string;
  state?: string;
  country?: string;
}
