import BloodPressure from "./BloodPressure";
import HeartRhythm from "./HeartRhythm";
import React from "react";

const HeartCard = () => {
  return (
    <div className="flex gap-2">
      <div className="w-full">
        <BloodPressure />
      </div>
      <div className="w-full">
        <HeartRhythm />
      </div>
    </div>
  );
};

export default HeartCard;
