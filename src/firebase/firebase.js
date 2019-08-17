import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import FirebaseContext from './context';

import { firebaseConfig } from '../config/config';

export const createUserProfileDocument = async ({
  uid,
  email,
  name,
  handle,
  role,
  company
}) => {
  const userRef = firestore.doc(`users/${uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    // Create new user
    const created_at = new Date();

    try {
      await userRef.set({
        email,
        name,
        handle,
        role,
        company,
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
        last_logged_in
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
