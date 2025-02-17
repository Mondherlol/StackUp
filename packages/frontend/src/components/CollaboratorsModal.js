"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaUserPlus, FaTrash, FaClipboard } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";

const CollaboratorsModal = ({ isOpen, onClose, warehouse, onUpdate }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("MEMBER");
  const [invitationRole, setInvitationRole] = useState("MEMBER");
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    if (search.trim() !== "" && !selectedUser) {
      const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get(
            `/user/search?query=${search}`
          );
          const filteredUsers = response.data.filter(
            (user) =>
              user._id !== warehouse.addedBy &&
              !warehouse.members.find(
                (member) => member.user.email === user.email
              )
          );
          setUsers(filteredUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [search, selectedUser]);

  useEffect(() => {
    if (selectedUser && search !== selectedUser.username) {
      setSelectedUser(null);
    }
  }, [search]);

  const generateInviteLink = async () => {
    try {
      const response = await axiosInstance.post(
        `/warehouse/${warehouse._id}/invite`,
        { role: invitationRole }
      );
      const link = response.data.inviteLink;
      setInviteLink(link);
      toast.success("Invite link generated successfully.");
    } catch (error) {
      console.error("Error generating invite link:", error);
      toast.error("Error generating invite link.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard.");
  };

  const handleInvite = async () => {
    if (selectedUser) {
      setSelectedUser(null);
      setSearch("");
      setUsers([]);
      setRole("MEMBER");
      try {
        let response = await axiosInstance.post(
          `/warehouse/${warehouse._id}/addMember`,
          {
            email: selectedUser.email,
            role,
          }
        );

        toast.success(`${selectedUser.username} added successfully.`);
      } catch (error) {
        console.error("Error inviting user:", error);
        toast.error("Error inviting user.");
      } finally {
        await onUpdate();
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      let response = await axiosInstance.delete(
        `/warehouse/${warehouse._id}/removeMember/${memberId}`
      );

      toast.success(`User removed successfully.`);
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Error removing user.");
    } finally {
      await onUpdate();
    }
  };

  const handleChangeRole = async (memberId, newRole) => {
    try {
      await axiosInstance.put(`/warehouse/${warehouse._id}/role/${memberId}`, {
        role: newRole,
      });

      await onUpdate();
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.success("Error updating role");
    } finally {
      await onUpdate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Collaborators</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search member..."
              value={selectedUser ? selectedUser.username : search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            {users.length > 0 && (
              <div className="absolute bg-white w-full border rounded-lg mt-1 shadow-md z-10">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      setSelectedUser(user);
                      setSearch(user.username);
                    }}
                  >
                    <span>{user.username}</span>
                    <span className="text-gray-400 text-sm">{user.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="GUEST">Guest</option>
          </select>

          <button
            onClick={handleInvite}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              selectedUser
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedUser}
          >
            <FaUserPlus /> Invite
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto mt-4">
          {warehouse.members.length > 0 ? (
            warehouse.members.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center p-2 border-b"
              >
                <p>{member.user.username}</p>
                <span className="text-gray-400 text-sm">
                  {member.user.email}
                </span>
                <select
                  value={member.role}
                  onChange={(e) => handleChangeRole(member._id, e.target.value)}
                  className="p-1 border rounded-lg"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MEMBER">Member</option>
                  <option value="GUEST">Guest</option>
                </select>
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No collaborators yet.</p>
          )}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Invitation Link</h3>
        <div className="flex items-center gap-2 mb-4">
          <select
            value={invitationRole}
            onChange={(e) => setInvitationRole(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="GUEST">Guest</option>
          </select>
          <button
            onClick={generateInviteLink}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Generate Invite Link
          </button>
          {inviteLink && (
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaClipboard /> Copy Link
            </button>
          )}
        </div>
        <h5 className="text-gray-500 text-sm">
          Generating a new link will make the previous one invalid.
        </h5>
      </motion.div>
    </div>
  );
};

export default CollaboratorsModal;
