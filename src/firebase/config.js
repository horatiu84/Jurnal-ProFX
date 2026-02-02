import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkl3IMy-cDv_tGEU_07OJvFpq1ru-Zoa4",
  authDomain: "trading-journal-f8e65.firebaseapp.com",
  projectId: "trading-journal-f8e65",
  storageBucket: "trading-journal-f8e65.firebasestorage.app",
  messagingSenderId: "1054523013178",
  appId: "1:1054523013178:web:d3768792123d3f38d71d03",
  measurementId: "G-9N4P036YNE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;