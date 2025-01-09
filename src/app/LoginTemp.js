"use client";

import { useAuth } from "./context/AuthContext";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const { signIn } = useAuth();

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Please sign in to view content</h1>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}
