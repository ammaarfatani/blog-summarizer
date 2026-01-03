import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcispNHul23Y-jOsrDON3eQE5nsZ64I9s",
  authDomain: "ai-blog-summarizer-a5624.firebaseapp.com",
  projectId: "ai-blog-summarizer-a5624",
  storageBucket: "ai-blog-summarizer-a5624.firebasestorage.app",
  messagingSenderId: "707493628460",
  appId: "1:707493628460:web:a3ab2cc0f4c330450f1f89"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
