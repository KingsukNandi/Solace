"use client";

import { onValue, ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

const Temperature = () => {
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    const dbRef = ref(database, "/email/body_temperature/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const newTemperature = snapshot.val();
        setTemperature(newTemperature);
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
            icon="material-symbols:device-thermostat"
            width="30"
            height="30"
            style={{ color: "#555" }}
          />
        </div>
        <p className="text-sm py-3">Body Temperature</p>
        <p className="text-lg flex items-start gap-1">
          <span className="text-2xl font-semibold">{Math.round(celsiusToFahrenheit(temperature))}</span>
          <span>&deg;F</span>
        </p>
      </div>
    </div>
  );
};

export default Temperature;
