import HealthCard from "./components/HealthCard";
import HeartCard from "./components/HeartCard";
import ContactDoctor from "./components/ContactDoctor";
import Temperature from "./components/Temperature";
import PredictedMood from "./components/PredictedMood";

export default function Home() {
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
