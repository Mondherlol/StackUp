const mongoose = require("mongoose");

const blocSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bloc",
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  width: {
    type: Number,
    required: false,
  },
  depth: {
    type: Number,
    required: false,
  },
  weight: {
    type: Number,
    required: false,
  },
  // Number of bloc it can contain
  capacity: {
    type: Number,
    required: false,
  },
  maxWeight: {
    type: Number,
    required: false,
  },
  position: {
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
  },
  blocs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bloc" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  customFields: [
    {
      field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomField",
        required: true,
      },
      value: { type: mongoose.Schema.Types.Mixed, required: false },
    },
  ],
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bloc", blocSchema);
