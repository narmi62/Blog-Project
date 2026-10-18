import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRqgE3pOs9HFhiPwTg9vRjx_SZwW6bE3c",
  authDomain: "blog-app-ca08b.firebaseapp.com",
  projectId: "blog-app-ca08b",
  storageBucket: "blog-app-ca08b.firebasestorage.app",
  messagingSenderId: "534081312378",
  appId: "1:534081312378:web:a5751040d4765aac454dc3",
  measurementId: "G-7DJYF1E2DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export default auth;
