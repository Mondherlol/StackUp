const mongoose = require("mongoose");

const customFieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldType: {
    type: String,
    enum: ["string", "number", "boolean", "date"],
    required: true,
  },
});

module.exports = mongoose.model("CustomField", customFieldSchema);
