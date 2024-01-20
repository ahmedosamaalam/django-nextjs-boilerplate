'use client';

import userService from '@/api/users';
import { auth } from '@/lib/firebase';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { writeToken, writeUser } from '../helper';

export function useProvideAuth() {
  const u = localStorage.getItem('user');
  const parsedUser = u ? JSON.parse(u) : null;
  const [user, setUser] = useState(parsedUser);

  const signIn = async ({ identifier, password }: any) => {
    // check if the identifier is an email or username

    const email = identifier.includes('@')
      ? identifier
      : (await userService.getEmailByUsername({ username: identifier })).data
          .email;
    try {
      const userCredential = (await signInWithEmailAndPassword(
        auth,
        email,
        password
      )) as any;

      const token = userCredential.user.accessToken;
      writeToken(token);

      const userProfile = await userService.getUserProfileById({ email });
      const uid = userCredential.user.uid;
      const u = userProfile.data.results[0];
      if (!u) {
        throw new Error('User details not found');
      }
      const userDetails = {
        uid,
        email,
        ...u,
      };

      setUser(userDetails);
      writeUser(userDetails);
      return userDetails;
    } catch (e) {
      let errorMessage = 'An error occurred. Please try again later.';
      if (
        e.code === 'auth/user-not-found' ||
        e.code === 'auth/wrong-password' ||
        e.code === 'auth/invalid-credential' ||
        e.code === 'auth/invalid-email' ||
        e.code === 'auth/user-disabled' ||
        e.code === 'auth/user-mismatch'
      ) {
        errorMessage = 'Invalid credentials. Please try again.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage =
          'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
      }
      toast.error(errorMessage);
      console.error(e);
      throw new Error(e);
    }
  };

  const forgotPassword = async ({ email }: any) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent, check your inbox');
    } catch (e: any) {
      console.log(e);
      let errorMessage = 'An error occurred. Please try again later.';
      if (
        e.code === 'auth/user-not-found' ||
        e.code === 'auth/invalid-email' ||
        e.code === 'auth/user-disabled' ||
        e.code === 'auth/user-mismatch'
      ) {
        errorMessage = 'Invalid credentials. Please try again.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage =
          'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
      }
      toast.error(errorMessage);
      console.error(e);
      throw new Error(e);
    }
  };

  const signOut = async () => {
    await auth.signOut();
    localStorage.clear();
    setUser(null);
    return null;
  };

  const updateUserData = async (userId: string, newUserData: object) => {
    const userProfile = await userService.updateProfile(userId, newUserData);

    const userDetails = userProfile.data || {};
    const updatedUser = {
      ...user,
      ...userDetails,
    };

    setUser(updatedUser);
    writeUser(updatedUser);
  };

  return {
    user,
    signIn,
    forgotPassword,
    signOut,
    updateUserData,
  };
}
