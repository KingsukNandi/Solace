"use client";

import { onValue, ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const HeartRhythm = () => {
  const [heartRate, setHeartRate] = useState(0);

  useEffect(() => {
    const dbRef = ref(database, "/email/heart_rate/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const newHeartRate = snapshot.val();
        setHeartRate(newHeartRate);
      } else {
        console.log("No data available");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#f6f6f6] flex p-2 rounded-3xl">
      <div className="p-3">
        <div className="bg-white w-fit p-3 rounded-full">
          <Icon
            icon="material-symbols:vital-signs"
            width="30"
            height="30"
            style={{ color: "#555" }}
          />
        </div>
        <p className="text-sm py-3">Heart Rate</p>
        <p className="text-lg flex items-start gap-1">
          <span className="text-2xl font-semibold">
            {Math.round(heartRate)}
          </span>
          /<span>min</span>
        </p>
      </div>
    </div>
  );
};

export default HeartRhythm;
