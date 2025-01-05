import OpenStreetMap from "../components/OpenStreetMap";

export default function Page() {
  return (
    <div className="px-6 py-4">
      <h1 className="text-3xl font-bold mb-6">Help Near Me</h1>
      <OpenStreetMap />
    </div>
  );
}
