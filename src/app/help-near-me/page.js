"use client";
import dynamic from "next/dynamic";

const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function Page() {
  return (
    <div className="px-6 py-4">
      <h1 className="text-3xl font-bold mb-6">Help Near Me</h1>
      <OpenStreetMap />
    </div>
  );
}
