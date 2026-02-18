import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "lms--login.firebaseapp.com",
  projectId: "lms--login",
  storageBucket: "lms--login.firebasestorage.app",
  messagingSenderId: "973098185940",
  appId: "1:973098185940:web:ac7e5f5f4baf70cf2c7741"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
