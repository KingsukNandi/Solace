"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpened, setIsOpened] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    setIsOpened(false); //TODO: make it false

    // return () => {
    //   second
    // }
  }, []);

  const navlinks = [
    {
      id: 1,
      label: "Overview",
      href: "/",
      icon: "material-symbols:ecg-rounded",
    },
    {
      id: 2,
      label: "Analysis",
      href: "/analysis",
      icon: "material-symbols:analytics-rounded",
    },
    {
      id: 3,
      label: "Diagnosis",
      href: "/diagnosis",
      icon: "material-symbols:diagnosis-rounded",
    },
    {
      id: 4,
      label: "AI Counsellor",
      href: "/counselor",
      icon: "material-symbols:diagnosis-rounded",
    },
    {
      id: 5,
      label: "Help Near Me",
      href: "/help-near-me",
      icon: "material-symbols:location-on-rounded",
    },
    {
      id: 6,
      label: "Settings",
      href: "/settings",
      icon: "material-symbols:settings-rounded",
    },
    {
      id: 7,
      label: "Logs",
      href: "/logs",
      icon: "material-symbols:settings-rounded",
    },
  ];

  return user ? (
    <nav className="flex justify-between px-6 py-4 z-[999999] relative">
      <button
        onClick={() => {
          setIsOpened(!isOpened);
        }}
        className="flex justify-center items-center z-10"
      >
        {isOpened ? (
          <Icon
            icon="material-symbols:close-rounded"
            width="35"
            height="35"
            style={{ color: "#000" }}
          />
        ) : (
          <Icon
            icon="material-symbols:dehaze-rounded"
            width="35"
            height="35"
            style={{ color: "#000" }}
          />
        )}
      </button>
      <div className="flex justify-center items-center gap-3">
        {user.displayName ? (
          <p className="text-xl font-bold">Hello, {user.displayName}!</p>
        ) : (
          <></>
        )}

        <div className="flex justify-center items-center">
          <Icon
            icon="material-symbols:person-outline-rounded"
            width="40"
            height="40"
            style={{ color: "#000" }}
          />
        </div>
      </div>

      {isOpened && (
        <div className="absolute top-0 right-0 h-screen w-screen flex">
          <div
            onClick={() => {
              setIsOpened(false);
            }}
            className="bg-gray-500 bg-opacity-30 w-[30%]"
          ></div>
          <div className="bg-white h-full w-[80%] flex flex-col justify-evenly items-center">
            <div className="flex flex-col text-xl gap-10">
              {navlinks.map((navlink) => (
                <Link
                  key={navlink.id}
                  href={navlink.href}
                  onClick={() => {
                    setIsOpened(false);
                  }}
                  className="flex gap-4"
                >
                  <Icon
                    icon={navlink.icon}
                    width="26"
                    height="26"
                    style={{ color: "#555" }}
                  />
                  <p>{navlink.label}</p>
                </Link>
              ))}
            </div>
            <div className="text-sm">
              Developed by <span className="font-bold">Team Solace</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  ) : (
    <></>
  );
};

export default Navbar;
