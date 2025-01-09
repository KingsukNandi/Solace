"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import logger from '../logger';

const analyticsLogger = logger.child('analytics');

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analysis() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState({
    heartRate: [],
    temperature: [],
    mood: [],
    sleep: [],
    activity: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    // Simulated data - replace with actual data fetching
    const generateData = () => {
      analyticsLogger.info('Generating mock health data for analysis');
      
      const now = new Date();
      const data = {
        heartRate: Array.from({ length: 24 }, (_, i) => ({
          time: new Date(now - (23 - i) * 3600000).toLocaleTimeString(),
          value: 60 + Math.random() * 30
        })),
        temperature: Array.from({ length: 24 }, (_, i) => ({
          time: new Date(now - (23 - i) * 3600000).toLocaleTimeString(),
          value: 36.5 + Math.random()
        })),
        mood: [
          { name: 'Happy', value: 40 },
          { name: 'Neutral', value: 30 },
          { name: 'Anxious', value: 20 },
          { name: 'Stressed', value: 10 }
        ],
        sleep: Array.from({ length: 7 }, (_, i) => ({
          day: new Date(now - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
          hours: 5 + Math.random() * 4
        })),
        activity: Array.from({ length: 7 }, (_, i) => ({
          day: new Date(now - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
          steps: Math.floor(2000 + Math.random() * 8000)
        }))
      };
      setHealthData(data);
      setLoading(false);
    };

    generateData();
  }, [selectedTimeRange]);

  if (!user) {
    return <div>Please log in to view analysis</div>;
  }

  if (loading) {
    return <div>Loading analysis...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Health Analysis</h1>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Heart Rate Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData.heartRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[40, 120]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="BPM"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Average: {Math.round(healthData.heartRate.reduce((acc, curr) => acc + curr.value, 0) / healthData.heartRate.length)} BPM
            </p>
          </div>
        </div>

        {/* Temperature Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Temperature Variations</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData.temperature}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[35, 38]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="°C"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData.mood}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {healthData.mood.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Pattern */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sleep Pattern</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData.sleep}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 12]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Average sleep: {(healthData.sleep.reduce((acc, curr) => acc + curr.hours, 0) / healthData.sleep.length).toFixed(1)} hours
            </p>
          </div>
        </div>

        {/* Activity Levels */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Activity Levels</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData.activity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Steps"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Average steps: {Math.round(healthData.activity.reduce((acc, curr) => acc + curr.steps, 0) / healthData.activity.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Health Insights */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Health Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Heart Health</h3>
            <p className="text-gray-600">
              Your heart rate has been within normal range. Consider increasing cardiovascular activities for better heart health.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Sleep Quality</h3>
            <p className="text-gray-600">
              Your average sleep duration is below recommended levels. Try to maintain a consistent sleep schedule.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Activity Level</h3>
            <p className="text-gray-600">
              You're averaging below the recommended 10,000 steps per day. Try to incorporate more walking into your daily routine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 