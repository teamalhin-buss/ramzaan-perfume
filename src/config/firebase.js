// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEOpVa1eebN0sSdI043ivyFxeDBjTZVH8",
  authDomain: "alhdot-41b3b.firebaseapp.com",
  projectId: "alhdot-41b3b",
  storageBucket: "alhdot-41b3b.firebasestorage.app",
  messagingSenderId: "1071419329111",
  appId: "1:1071419329111:web:a2a0b25a918e7181ffb112",
  measurementId: "G-NJCWW7XVVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;