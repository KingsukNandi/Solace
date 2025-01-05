"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const OpenStreetMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState({ lat: "", lon: "" });

  // Fetch nearby hospitals using Overpass API (OpenStreetMap)
  const fetchNearbyHospitals = async (lat, lon) => {
    const radius = 5000; // Search within 5km radius
    const query = `[out:json][timeout:25];
      node["amenity"~"hospital|pharmacy|clinic|doctor|dentist"](around:${radius},${lat},${lon});
      out body;
      >;
      out skel qt;`;

    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setHospitals(data.elements);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError("Failed to fetch hospitals. Please try again later.");
    }
  };

  // Get user's current location
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getLocation = () => {
        if (typeof window !== "undefined" && navigator.geolocation) {
          const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          };

          const success = (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
            fetchNearbyHospitals(latitude, longitude);
          };

          const error = (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            setError(
              "Unable to retrieve your location. Please enable location services."
            );
          };

          try {
            navigator.geolocation.getCurrentPosition(success, error, options);
          } catch (error) {
            console.error("Error getting location:", error);
            setError("An unexpected error occurred. Please try again.");
          }
        }
      };

      getLocation();
    }
  }, []);

  // Handle manual location input
  const handleManualLocation = (event) => {
    event.preventDefault();
    const { lat, lon } = manualLocation;
    if (lat && lon) {
      setUserLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
      fetchNearbyHospitals(parseFloat(lat), parseFloat(lon));
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {userLocation ? (
        <MapContainer
          center={[userLocation.lat, userLocation.lon]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[userLocation.lat, userLocation.lon]}
            icon={defaultIcon}
          >
            <Popup>Your Location</Popup>
          </Marker>
          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lon]}
              icon={defaultIcon}
            >
              <Popup>
                <div>
                  <h3>{hospital.tags?.name || "Hospital"}</h3>
                  <p>{hospital.tags?.addr_street || "Address not available"}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div>
          <p>Loading map...</p>
          <form onSubmit={handleManualLocation}>
            <input
              type="text"
              placeholder="Latitude"
              value={manualLocation.lat}
              onChange={(e) =>
                setManualLocation({ ...manualLocation, lat: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Longitude"
              value={manualLocation.lon}
              onChange={(e) =>
                setManualLocation({ ...manualLocation, lon: e.target.value })
              }
              required
            />
            <button type="submit">Set Location</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMap;
