import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import FirebaseContext from './context';

import { firebaseConfig } from '../config/config';

export const createUserProfileDocument = async ({
  uid,
  email,
  first_name,
  last_name,
  profile_picture,
  role,
  emailVerified
}) => {
  const userRef = firestore.doc(`users/${uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    // Create new user
    const created_at = new Date();

    try {
      await userRef.set({
        email,
        first_name,
        last_name,
        profile_picture,
        role,
        emailVerified,
        created_at
      });
    } catch (error) {
      console.log(error.message);
    }
  } else {
    // Update user
    const last_logged_in = new Date();

    try {
      await userRef.update({
        last_logged_in,
        emailVerified
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return userRef;
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export { FirebaseContext };

export default firebase;
