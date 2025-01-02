import { Icon } from "@iconify/react";

const PredictedMood = () => {
    return (
      <div className="bg-[#f6f6f6] flex p-2 rounded-3xl">
        <div className="p-3">
          <div className="bg-white w-fit p-3 rounded-full">
            <Icon
              icon="material-symbols:mood-outline-rounded"
              width="30"
              height="30"
              style={{ color: "#555" }}
            />
          </div>
          <p className="text-sm py-3">Predicted Mood</p>
          <p className="text-lg flex items-start gap-1">
            <span className="text-xl font-semibold">Relaxed</span>
          </p>
        </div>
      </div>
    );
}

export default PredictedMood;