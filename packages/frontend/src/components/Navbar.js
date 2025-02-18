"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiChevronDown, FiLogOut, FiSettings } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="fixed z-10 top-4 right-6 flex items-center space-x-4 bg-blue-100 p-2 rounded-xl shadow-lg">
      {/* Profil et pseudo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={`https://ui-avatars.com/api/?name=${user.username}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <span className="text-gray-800 font-medium hidden sm:block">
          {user.username}
        </span>
        <FiChevronDown className="text-gray-500" />
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute top-14 right-6 bg-white shadow-lg rounded-lg w-48 py-2">
          <ul className="text-gray-700">
            <li className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-100 cursor-pointer">
              <FiSettings className="text-blue-600" />
              <span>Paramètres</span>
            </li>
            <li
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              <FiLogOut className="text-red-600" />
              <span>Déconnexion</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
