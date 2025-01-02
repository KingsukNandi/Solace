import { Icon } from "@iconify/react";

const ContactDoctor = () => {
  return (
    <div className="bg-[#fbe285] rounded-full p-2 flex items-center justify-between gap-4">
      <div className="bg-white rounded-full p-3">
        <Icon
          icon="material-symbols:person-outline-rounded"
          width="30"
          height="30"
          style={{ color: "#000" }}
        />
      </div>
      <p className="text-sm font-bold">Contact for Immediate Help</p>
      <div className="bg-white rounded-full p-3">
        <Icon
          icon="material-symbols:mode-comment-outline-rounded"
          width="30"
          height="30"
          style={{ color: "#000" }}
        />
      </div>
      <div className="bg-white rounded-full p-3">
        <Icon
          icon="material-symbols:phone-forwarded-outline-rounded"
          width="30"
          height="30"
          style={{ color: "#000" }}
        />
      </div>
    </div>
  );
};

export default ContactDoctor;
