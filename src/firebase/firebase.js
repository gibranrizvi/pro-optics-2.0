import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { format } from 'date-fns';

import FirebaseContext from './context';
import { firebaseConfig } from '../config/config';

const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary');

// Create user with firebase auth
export const createNewUser = (email, password) => {
  return secondaryApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      secondaryApp.auth().signOut();
      return user;
    });
};

// Create or update a user document
export const createUserProfileDocument = async ({
  uid,
  email,
  name,
  handle,
  role,
  company,
  created_by
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
        created_at,
        created_by
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

// Create or update a ticket
export const createTicketDocument = async (ticketData, currentUser) => {
  const providerDocRef = firestore.doc(`/providers/${ticketData.provider}`);
  const providerRef = await providerDocRef.get();
  const { counter } = providerRef.data();

  const currentYear = format(new Date(), 'YYYY');

  const ticketsCollectionRef = providerDocRef.collection(`tickets`);
  const ticketDocRef = ticketsCollectionRef.doc(
    `${currentYear}-${counter + 1}`
  );
  const snapshot = await ticketDocRef.get();

  const ticketFields = {};
  ticketFields.endUserInfo = {};
  ticketFields.networkInfo = {};
  ticketFields.equipment = {};
  ticketFields.comments = [];
  ticketFields.closed = false;

  const standardFields = [
    'ticketType',
    'provider',
    'description',
    'tvPackage',
    'internetPackage'
  ];

  const endUserInfoFields = [
    'name',
    'id',
    'nin',
    'address',
    'parcelNumber',
    'telephone1',
    'telephone2',
    'telephone3',
    'email'
  ];

  const networkInfoFields = [
    'nodeLocation',
    'tnaLocation',
    'le',
    'tap',
    'dB',
    'psLocation',
    'hubLocation'
  ];

  const equipmentFields = [
    'phone',
    'phoneMac',
    'phoneSerial',
    'iptv',
    'iptvMac',
    'iptvSerial',
    'vod',
    'vodMac',
    'vodSerial',
    'dualView',
    'dualViewMac',
    'dualViewSerial',
    'stbPet',
    'stbPetMac',
    'stbPetSerial',
    'stbNeta',
    'stbNetaMac',
    'stbNetaSerial',
    'ont2426',
    'ont2426Mac',
    'ont2426Serial',
    'ont2424',
    'ont2424Mac',
    'ont2424Serial',
    'technoColour',
    'technoColourMac',
    'technoColourSerial'
  ];

  standardFields.forEach(field => {
    if (ticketData[field]) ticketFields[field] = ticketData[field];
  });

  endUserInfoFields.forEach(field => {
    if (ticketData[field]) ticketFields.endUserInfo[field] = ticketData[field];
  });

  networkInfoFields.forEach(field => {
    if (ticketData[field]) ticketFields.networkInfo[field] = ticketData[field];
  });

  equipmentFields.forEach(field => {
    if (ticketData[field]) ticketFields.equipment[field] = ticketData[field];
  });

  if (ticketData.leadsman) {
    ticketFields.leadsman = ticketData.technicians.find(
      technician => technician.id === ticketData.leadsman
    );
    ticketFields.status = ticketData.status ? ticketData.status : 'Issued';
    if (ticketData.assistant) {
      ticketFields.assistant = ticketData.technicians.find(
        technician => technician.id === ticketData.assistant
      );
    }
  } else {
    ticketFields.status = 'Unassigned';
  }

  if (!snapshot.exists) {
    // Create new ticket
    const created_at = new Date();
    const created_by = currentUser;

    try {
      ticketDocRef
        .set({
          ...ticketFields,
          created_at,
          created_by
        })
        .then(
          async () =>
            await providerDocRef.update({
              counter: counter + 1
            })
        );
    } catch (error) {
      console.log(error.message);
    }
  } else {
    // Update ticket
    const last_updated_at = new Date();
    const last_updated_by = currentUser;

    try {
      await ticketDocRef.update({
        last_updated_at,
        last_updated_by
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return ticketDocRef;
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export { FirebaseContext };

export default firebase;
