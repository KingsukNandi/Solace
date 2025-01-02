import { Icon } from "@iconify/react";

const Navbar = () => {
  return (
    <nav className="flex justify-between px-6 py-4">
      <div className="flex justify-center items-center gap-3">
        <div className="flex justify-center items-center">
          <Icon
            icon="material-symbols:person-outline-rounded"
            width="40"
            height="40"
            style={{ color: "#000" }}
          />
        </div>
        <p className="text-xl font-bold">Hello, Kingsuk!</p>
      </div>
      <div className="flex justify-center items-center">
        <Icon
          icon="material-symbols:notifications-outline-rounded"
          width="35"
          height="35"
          style={{ color: "#000" }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
