import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd94qXzPHVnxYfvtZSQwCi7cJmI1DYXQM",
  authDomain: "solace-68285.firebaseapp.com",
  databaseURL:
    "https://solace-68285-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "solace-68285",
  storageBucket: "solace-68285.firebasestorage.app",
  messagingSenderId: "750504150857",
  appId: "1:750504150857:web:bbb4051eb9f049df063c98",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
