import { Icon } from "@iconify/react";

const HealthCard = () => {
    return (
        <div className="bg-[#d0e9bc] flex p-2 rounded-3xl">
          <div className="w-1/2 p-3">
            <div className="bg-white w-fit p-3 rounded-full">
              <Icon
                icon="material-symbols:ecg-heart-outline"
                width="30"
                height="30"
                style={{ color: "#555" }}
              />
            </div>
            <p className="text-2xl font-semibold py-3">Health</p>
            <p className="text-sm pb-3">Check your heart&apos;s health</p>
            <button className="font-semibold border border-black rounded-full px-4 py-1">
              Diagnostic
            </button>
          </div>
          <div className="w-1/2 bg-white rounded-2xl"></div>
        </div>

    );
}

export default HealthCard;