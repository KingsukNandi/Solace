"use client";

import { onValue, ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const BloodPressure = () => {
  const [systolicPressure, setSystolicPressure] = useState(0);
  const [diastolicPressure, setDiastolicPressure] = useState(0);

  useEffect(() => {
    const dbRef = ref(database, "/email/systolic_pressure/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const newSystolicPressure = snapshot.val();
        setSystolicPressure(newSystolicPressure);
      } else {
        console.log("No data available");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dbRef = ref(database, "/email/diastolic_pressure/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const newDiastolicPressure = snapshot.val();
        setDiastolicPressure(newDiastolicPressure);
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
            icon="material-symbols:stethoscope-outline-rounded"
            width="30"
            height="30"
            style={{ color: "#555" }}
          />
        </div>
        <p className="text-sm py-3">Blood Pressure</p>
        <p className="text-lg flex items-start gap-1">
          <span className="text-2xl font-semibold">
            {Math.round(systolicPressure)}
          </span>
          /<span>{Math.round(diastolicPressure)}</span>
        </p>
      </div>
    </div>
  );
};

export default BloodPressure;
