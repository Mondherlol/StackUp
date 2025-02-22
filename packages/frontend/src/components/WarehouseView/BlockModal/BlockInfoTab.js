"use client";
import axiosInstance from "@/utils/axiosConfig";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaWeight, FaBoxOpen, FaRulerCombined, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import NotesSection from "./NoteSection";
const { getBackendImageUrl } = require("@/utils/imageUrl");

const BlockInfoTab = ({ block }) => {
  return (
    <>
      <div
        className={`grid grid-cols-1 sm:grid-cols-${
          block.picture ? "2" : "1"
        } gap-4 mt-4 `}
      >
        {block.picture && (
          <img
            src={getBackendImageUrl(block.picture)}
            alt={block.name}
            className="mx-auto my-4 rounded-lg shadow-md max-w-sm object-cover h-48"
          />
        )}

        <div className="grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded-lg shadow">
          <DetailRow
            icon={FaRulerCombined}
            label="Dimensions"
            value={`${block.width ?? "N/A"} x ${block.height ?? "N/A"} x ${
              block.depth ?? "N/A"
            }`}
          />
          <DetailRow
            icon={FaWeight}
            label="Weight"
            value={`${block.weight ?? "N/A"} kg`}
          />
          <DetailRow
            icon={FaWeight}
            label="Max Weight"
            value={`${block.maxWeight ?? "N/A"} kg`}
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
        <FaClock className="mr-2" /> Created on{" "}
        <strong>
          {block.createdAt
            ? new Date(block.createdAt).toLocaleDateString()
            : "Unknown"}
        </strong>
        by <strong>{block.addedBy?.username ?? "Unknown"}</strong>, last updated
        on{" "}
        <strong>
          {block.lastUpdate
            ? new Date(block.lastUpdate).toLocaleString()
            : "Unknown"}
        </strong>
        .
      </p>

      <NotesSection blocId={block._id} />
    </>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <p className="flex gap-2 items-center text-gray-700 bg-white p-3 rounded-lg shadow-sm">
    <Icon className="mr-2 text-blue-500" />
    <strong>{label}:</strong> {value}
  </p>
);

export default BlockInfoTab;
