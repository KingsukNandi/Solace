"use client";
import HealthCard from "./components/HealthCard";
import HeartCard from "./components/HeartCard";
import ContactDoctor from "./components/ContactDoctor";
import Temperature from "./components/Temperature";
import PredictedMood from "./components/PredictedMood";
import { useAuth } from "./context/AuthContext";
import Login from "./Login";

export default function Home() {
  const { user, logOut } = useAuth();
  if (!user) {
    return <Login />;
  }
  // console.log(user);

  return (
    <div className="px-3">
      <p className="text-5xl font-bold leading-tight pb-4">
        Tracking your health
      </p>
      <div className="flex flex-col gap-2">
        <HealthCard />
        <HeartCard />
        <div className="flex gap-2">
          <div className="w-full">
            <Temperature />
          </div>
          <div className="w-full">
            <PredictedMood />
          </div>
        </div>
        <ContactDoctor />
      </div>
    </div>
  );
}
