import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  projectId: "harvestsmart-48704",
  appId: "1:707509188885:android:264a12c74cdd68b52fd11c",
  storageBucket: "harvestsmart-48704.appspot.com",
  apiKey: "AIzaSyBGWODXkXF2qm_Z4P5-0X5ZF9kFWzgkYHM",
  authDomain: "harvestsmart-48704.firebaseapp.com",
  messagingSenderId: "707509188885",
  databaseURL: "https://harvestsmart-48704.firebaseio.com",
};

let app;
let authInstance: FirebaseAuthTypes.Module;
let firestoreInstance;

try {
  if (!getApps().length) {
    console.log('Initializing Firebase...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    app = getApp();
    console.log('Firebase app already initialized');
  }
  
  authInstance = auth();
  console.log('Firebase Auth initialized successfully');
  
  firestoreInstance = firestore();
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

if (!app || !authInstance || !firestoreInstance) {
  const error = new Error('Failed to initialize Firebase services');
  console.error(error);
  throw error;
}

export { authInstance as auth, firestoreInstance as firestore };
export type Auth = FirebaseAuthTypes.Module;