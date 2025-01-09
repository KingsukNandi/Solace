"use client";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import logger from './logger';

const authLogger = logger.child('auth');

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

function Login() {
  const { signIn } = useAuth();
  const [clicked, setClicked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleAuth = async (data) => {
    setClicked(true);
    setAuthError("");

    try {
      if (isSignUp) {
        // Sign up
        authLogger.info({ email: data.email }, 'Attempting to create new account');
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        authLogger.info({ email: data.email }, 'Successfully created new account');
      } else {
        // Sign in
        authLogger.info({ email: data.email }, 'Attempting to sign in');
        await signInWithEmailAndPassword(auth, data.email, data.password);
        authLogger.info({ email: data.email }, 'Successfully signed in');
      }
      reset();
    } catch (error) {
      authLogger.error(
        { error: error.message, email: data.email },
        'Authentication failed'
      );
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setAuthError('An account with this email already exists');
          break;
        case 'auth/wrong-password':
          setAuthError('Incorrect password');
          break;
        case 'auth/user-not-found':
          setAuthError('No account found with this email');
          break;
        case 'auth/too-many-requests':
          setAuthError('Too many attempts. Please try again later');
          break;
        default:
          setAuthError('Authentication failed. Please try again');
      }
    } finally {
      setClicked(false);
    }
  };

  return (
    <>
      <div className="flex h-svh w-screen justify-center items-center font-monaSans">
        <div className="md:w-[55%]">
          <div className="p-6 md:min-w-80 md:max-w-[600px] m-auto">
            <h1 className="font-bold text-3xl pb-2 leading-8">
              {isSignUp ? "Create an account" : "Login to your account"}
            </h1>
            <p className="leading-5">
              {isSignUp 
                ? "Sign up to start tracking your progress"
                : "Continue tracking your progress after logging in to your account"
              }
            </p>

            {/* Google Sign In Button */}
            <div className="py-9">
              <button
                onClick={signIn}
                className="w-full border rounded-md p-2 font-semibold flex justify-center items-center gap-3 active:scale-95 transition-all"
              >
                <Icon icon="devicon:google" width="15" height="15" />
                {isSignUp ? "Sign up with Google" : "Login with Google"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex justify-center items-center">
              <hr className="w-full" />
              <div className="px-2">or</div>
              <hr className="w-full" />
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {authError}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit(handleAuth)} className="py-9 font-semibold">
              <div className="flex flex-col gap-6 pb-5">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Email address"
                    className="w-full border border-t-0 border-l-0 border-r-0 pb-2 outline-none focus:border-b-gray-400 transition-all"
                  />
                  {errors.email?.message && (
                    <p className="font-normal text-sm text-red-500 pt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Password"
                      className="w-full border border-t-0 border-l-0 border-r-0 pb-2 outline-none focus:border-b-gray-400 transition-all"
                    />
                    <button
                      type="button"
                      className="flex justify-center items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <Icon
                          icon="mage:eye"
                          width="22"
                          height="22"
                          style={{ color: "#9ca3af" }}
                        />
                      ) : (
                        <Icon
                          icon="mage:eye-off"
                          width="22"
                          height="22"
                          style={{ color: "#9ca3af" }}
                        />
                      )}
                    </button>
                  </div>
                  {errors.password?.message && (
                    <p className="font-normal text-sm text-red-500 pt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded-md active:bg-blue-600 active:scale-95 transition-all"
                disabled={clicked}
              >
                {clicked ? (
                  <Icon
                    icon="svg-spinners:90-ring-with-bg"
                    width="24"
                    height="24"
                    style={{ color: "#fff" }}
                  />
                ) : (
                  <span className="flex justify-center items-center">
                    {isSignUp ? "Sign Up" : "Login"}
                    <Icon
                      icon="uim:angle-right"
                      width="24"
                      height="24"
                      style={{ color: "#fff" }}
                    />
                  </span>
                )}
              </button>
            </form>

            {/* Toggle Sign Up/Login */}
            <p className="font-semibold">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError("");
                  reset();
                }}
                className="text-blue-500 active:text-blue-700"
              >
                {isSignUp ? "Login here" : "Create one now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
