"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// const data = [
//   {
//     name: "Page A",
//     uv: 120,
//     pv: 80,
//   },
// ];

class FixedSizeJSONArray {
  constructor(maxSize) {
    this.maxSize = maxSize; // Maximum size of the array
    this.data = []; // Array to store JSON objects
    this.currentSize = 0; // Current number of elements in the array
  }

  // Method to push a JSON object into the array
  push(value) {
    if (this.currentSize >= this.maxSize) {
      // Remove the oldest element (from the rear end)
      this.data.shift();
      this.currentSize--;
    }
    // Add the new value to the array
    this.data.push(value);
    this.currentSize++;
  }

  // Method to generate and push random JSON objects

  generateRandomValues(count) {
    for (let i = 0; i < count; i++) {
      const randomValue = {
        id: i + 1,
        timestamp: new Date().toISOString(),
        value: Math.floor(Math.random() * 100), // Random value between 0 and 100
      };
      this.push(randomValue); // Push the random JSON object
    }
  }
}

const EcgData = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // Create a fixed-size JSON array with a maximum size of 10
    const jsonArray = new FixedSizeJSONArray(8);

    // Function to generate a random value and push it into the array
    const generateRandomValue = () => {
      const randomValue = {
        id: jsonArray.currentSize + 1,
        value: Math.floor(Math.random() * 30) - 10, // Random value between 0 and 100
      };
      jsonArray.push(randomValue);
      setData([...jsonArray.data]); // Update the state with the new data
    };

    // Generate a random value every second
    const intervalId = setInterval(generateRandomValue, 200);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="-z-10">
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={data} margin={{ top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" padding={{ left: 0, right: 10 }} />
          <YAxis dataKey="value" domain={[-10, 20]} />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef596f"
            activeDot={{ r: 8 }}
            isAnimationActive={false}
          >
            <LabelList position="top" />
          </Line>
          <Line type="monotone" dataKey="timestamp" stroke="#ef596f">
            <LabelList position="top" />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EcgData;
