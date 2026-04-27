import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDSYALT_jaIQrTq-oZP9sMyUJWXaLSjTY4",
  authDomain: "nur-shop-siam.firebaseapp.com",
  projectId: "nur-shop-siam",
  storageBucket: "nur-shop-siam.firebasestorage.app",
  messagingSenderId: "536596371721",
  appId: "1:536596371721:web:454f879521237e61211bd8"
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let messaging: Messaging | undefined;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase API key is missing. Please check your .env file.");
}

export { db, auth, messaging };
