const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    address: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    coordinates: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
  },
  blocs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bloc" }], // Liste des blocs dans l'entrepôt
  maxCapacity: {
    type: Number,
    required: false,
  },
  maxWeight: {
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
  pendingUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
});

module.exports = mongoose.model("Warehouse", warehouseSchema);
