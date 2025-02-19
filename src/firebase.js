import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
          apiKey: "AIzaSyCKNT945DDmEbqqpSX_OeSn7fpB7qjS67Q",
          authDomain: "learn-ai-8169a.firebaseapp.com",
          databaseURL: "https://learn-ai-8169a-default-rtdb.firebaseio.com",
          projectId: "learn-ai-8169a",
          storageBucket: "learn-ai-8169a.firebasestorage.app",
          messagingSenderId: "684343542640",
          appId: "1:684343542640:web:824e8b5988c7d751d505b5",
          measurementId: "G-6VT8H39MVE"
        };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
