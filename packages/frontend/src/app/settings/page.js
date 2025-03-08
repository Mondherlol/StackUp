"use client";
import React, { useState } from "react";

const SettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfilePictureChange = (e) =>
    setProfilePicture(URL.createObjectURL(e.target.files[0]));

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleUpdate = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen  flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Profile Settings
        </h1>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={
                profilePicture
                  ? profilePicture
                  : `https://ui-avatars.com/api/?name=Mondher`
              }
              alt="Picture"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
            />
            {isEditing && (
              <input
                type="file"
                onChange={handleProfilePictureChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            )}
          </div>
          {isEditing && (
            <span className="text-sm text-gray-500 mt-2">Click to change</span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                !isEditing && "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                !isEditing && "bg-gray-100"
              }`}
            />
          </div>
          {isEditing && (
            <>
              <div>
                <label className="block text-gray-700 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={toggleEdit}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isEditing
                ? "bg-gray-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
