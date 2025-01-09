"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Icon } from "@iconify/react";
import logger from '../logger';

const diagnosisLogger = logger.child('diagnosis');

export default function Diagnosis() {
  const { user } = useAuth();
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPrediction = async () => {
    try {
      // Mock data for demonstration - replace with actual sensor data
      const mockSensorData = {
        heartRate: 75 + Math.random() * 10,
        SpO2: 97 + Math.random() * 2,
        bodyTemp: 36.5 + Math.random() * 1,
        age: 30,
        gender: 1,
        weight: 70,
        lifestyleActivityLevel: 0.7,
        sleepHrs: 7
      };

      // Normalize the data between 0 and 1
      const features = [
        mockSensorData.heartRate / 100,
        mockSensorData.SpO2 / 100,
        mockSensorData.bodyTemp / 40,
        mockSensorData.lifestyleActivityLevel,
        mockSensorData.sleepHrs / 12
      ];

      diagnosisLogger.info(
        { features },
        'Sending data to AI server'
      );

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      
      diagnosisLogger.info(
        { 
          mental_health_score: data.mental_health_score,
          depression_risk: data.depression_risk 
        },
        'Received prediction from AI server'
      );

      // Add new data point with timestamp
      const newDataPoint = {
        timestamp: new Date().toLocaleTimeString(),
        mentalHealthScore: data.mental_health_score,
        depressionRisk: data.depression_risk * 100, // Convert to percentage
        rawFeatures: features
      };

      setHourlyData(prev => {
        const updated = [...prev, newDataPoint].slice(-24); // Keep last 24 hours
        return updated;
      });
      
      setLastUpdate(new Date());
    } catch (error) {
      diagnosisLogger.error(
        { error: error.message },
        'Failed to fetch prediction'
      );
      setError('Failed to fetch prediction. Please try again later.');
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      setLoading(true);
      await fetchPrediction();
      setLoading(false);
    };

    fetchInitialData();

    // Set up hourly updates
    const interval = setInterval(fetchPrediction, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return <div className="p-6">Please log in to view diagnosis</div>;
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Icon icon="svg-spinners:90-ring-with-bg" className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mental Health Diagnosis</h1>
        <p className="text-gray-600">
          Hourly mental health analysis based on your vital signs and activity data
        </p>
        {lastUpdate && (
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleString()}
          </p>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : (
        <>
          {/* Main Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Mental Health Metrics (Last 24 Hours)</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-lg shadow-lg border">
                            <p className="font-semibold">{label}</p>
                            <p className="text-blue-600">
                              Mental Health Score: {payload[0].value.toFixed(1)}
                            </p>
                            <p className="text-red-600">
                              Depression Risk: {payload[1].value.toFixed(1)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="mentalHealthScore"
                    name="Mental Health Score"
                    fill="#4F46E5"
                    opacity={0.8}
                  />
                  <Bar
                    dataKey="depressionRisk"
                    name="Depression Risk (%)"
                    fill="#EF4444"
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Current Mental Health Status</h3>
              {hourlyData.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">Mental Health Score</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {hourlyData[hourlyData.length - 1].mentalHealthScore.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Depression Risk</p>
                    <p className="text-3xl font-bold text-red-600">
                      {hourlyData[hourlyData.length - 1].depressionRisk.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-2">
                {hourlyData.length > 0 && hourlyData[hourlyData.length - 1].depressionRisk > 50 ? (
                  <>
                    <p className="text-red-600 font-semibold">High Risk Detected</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Consider scheduling a consultation with a mental health professional</li>
                      <li>Practice stress-reduction techniques</li>
                      <li>Maintain regular sleep schedule</li>
                      <li>Engage in physical activity</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-green-600 font-semibold">Low to Moderate Risk</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Continue maintaining healthy lifestyle habits</li>
                      <li>Regular exercise and adequate sleep</li>
                      <li>Stay connected with friends and family</li>
                      <li>Practice mindfulness or meditation</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 