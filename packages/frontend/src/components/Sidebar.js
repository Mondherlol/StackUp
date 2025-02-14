"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaCubes, FaWrench, FaBoxOpen, FaCog } from "react-icons/fa";
import { LuArrowLeftFromLine } from "react-icons/lu";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSwipe = (event) => {
      if (event.touches[0].clientX < 50) {
        setIsOpen(true);
      } else if (event.touches[0].clientX > 250) {
        setIsOpen(false);
      }
    };

    document.addEventListener("touchstart", handleSwipe);
    return () => document.removeEventListener("touchstart", handleSwipe);
  }, []);

  return (
    <div className="flex">
      {/* Bouton stylisé pour ouvrir la sidebar en mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full min-h-screen bg-blue-100 p-6 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none`}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">StackUp</h2>
        <nav>
          <ul className="space-y-4">
            <NavItem
              href="/warehouses"
              icon={<FaCubes />}
              label="Warehouses"
              active
            />
            <NavItem
              href="/management"
              icon={<FaWrench />}
              label="Management"
            />
            <NavItem
              href="/categorize"
              icon={<FaBoxOpen />}
              label="Categorize"
            />
            <NavItem
              href="/settings"
              icon={<FaCog />}
              label="System Settings"
            />
          </ul>
          <button
            className="absolute bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none xl:hidden"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <LuArrowLeftFromLine />
          </button>
        </nav>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, href, active }) => {
  return (
    <li>
      <Link href={href} passHref>
        <div
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
            active
              ? "bg-blue-200 text-blue-700 font-semibold"
              : "text-gray-700 hover:bg-blue-200 hover:text-blue-700"
          }`}
        >
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
};

export default Sidebar;
