"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logger from '../logger/index';

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

const mapLogger = logger.child('map');
// const debugLogger = logger.child('debug');
const locationLogger = logger.child('location');
const auditLogger = logger.child('audit');

const OpenStreetMap = () => {
  // debugLogger.debug(
  //   { count: data.elements.length },
  //   'Successfully fetched hospitals'
  // );
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState({ lat: "", lon: "" });

  // Fetch nearby hospitals using Overpass API (OpenStreetMap)
  const fetchNearbyHospitals = async (lat, lon) => {
    const radius = 5000; // Search within 5km radius
    const query = `[out:json][timeout:25];
      node["amenity"~"hospital|pharmacy|clinic|doctor|social_facility|nursing_home"](around:${radius},${lat},${lon});
      out body;
      >;
      out skel qt;`;

    try {
      mapLogger.info({ lat, lon, radius }, 'Fetching nearby hospitals');
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      
      mapLogger.info(
        { count: data.elements.length },
        'Successfully fetched hospitals'
      );
      
      setHospitals(data.elements);
      
      // Audit log for successful hospital search
      auditLogger.info({
        action: 'HOSPITALS_SEARCH',
        location: { lat, lon },
        resultCount: data.elements.length,
      });
    } catch (error) {
      mapLogger.error(
        { err: error, lat, lon },
        'Failed to fetch nearby hospitals'
      );
      setError("Failed to fetch hospitals. Please try again later.");
    }
  };

  // Get user's current location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };

        const success = (position) => {
          const { latitude, longitude } = position.coords;
          locationLogger.info(
            { lat: latitude, lon: longitude },
            'Successfully got user location'
          );
          
          setUserLocation({ lat: latitude, lon: longitude });
          fetchNearbyHospitals(latitude, longitude);
          
          // Audit successful location access
          auditLogger.info({
            action: 'LOCATION_ACCESS',
            status: 'success',
            source: 'geolocation',
          });
        };

        const error = (err) => {
          locationLogger.error(
            { 
              code: err.code,
              message: err.message 
            },
            'Failed to get user location'
          );
          
          setError(
            "Unable to retrieve your location. Please enable location services."
          );
          
          // Audit failed location access
          auditLogger.warn({
            action: 'LOCATION_ACCESS',
            status: 'failed',
            error: {
              code: err.code,
              message: err.message,
            },
          });
        };

        try {
          navigator.geolocation.getCurrentPosition(success, error, options);
        } catch (error) {
          locationLogger.error(
            { err: error },
            'Unexpected error getting location'
          );
          setError("An unexpected error occurred. Please try again.");
        }
      }
    };

    getLocation();
  }, []);

  // Handle manual location input
  const handleManualLocation = (event) => {
    event.preventDefault();
    const { lat, lon } = manualLocation;
    
    if (lat && lon) {
      locationLogger.info(
        { lat, lon },
        'Manual location entered'
      );
      
      setUserLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
      fetchNearbyHospitals(parseFloat(lat), parseFloat(lon));
      
      // Audit manual location entry
      auditLogger.info({
        action: 'MANUAL_LOCATION_ENTRY',
        location: { lat, lon },
      });
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
