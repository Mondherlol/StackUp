const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  location: {
    address: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
  },
  blocs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bloc" }], // Liste des blocs dans l'entrepôt
  maxWeight: {
    type: Number,
    required: false,
  },
  width: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  depth: {
    type: Number,
    required: false,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ["ADMIN", "MEMBER", "GUEST"],
        default: "MEMBER",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  planImage: {
    type: String,
    required: false,
  },
  inviteToken: {
    type: String,
    required: false,
  },
  inviteTokenExpires: {
    type: Date,
    required: false,
  },
  inviteRole: {
    type: String,
    required: false,
    enum: ["ADMIN", "MEMBER", "GUEST"],
    default: "MEMBER",
  },
});

module.exports = mongoose.model("Warehouse", warehouseSchema);
