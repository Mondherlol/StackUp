const Tag = require("../models/tagModel");
const Warehouse = require("../models/warehouseModel");
const Bloc = require("../models/blocModel");

const addTag = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const existingTag = await Tag.findOne({ name, warehouse: warehouseId });

    if (existingTag) {
      return res
        .status(400)
        .json({ message: "This tag already exist in this warehouse." });
    }

    const tag = new Tag({
      name,
      color: color || "#000000",
      warehouse: warehouseId,
    });

    await tag.save();

    res.status(201).json({ message: "Tag added with success", tag });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const blocsUsingTag = await Bloc.find({ tags: tagId });
    for (let bloc of blocsUsingTag) {
      bloc.tags = bloc.tags.filter((tag) => tag.toString() !== tagId);
      await bloc.save();
    }

    await Tag.deleteOne({ _id: tagId });

    return res.status(200).json({ message: "Tag deleted with success" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error);
  }
};

const getAllTags = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const tags = await Tag.find({ warehouse: warehouseId });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name, color } = req.body;

    const tag = await Tag.findById(tagId);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    tag.name = name || tag.name;
    tag.color = color || tag.color;
    await tag.save();

    res.status(200).json({ message: "Tag updated with success", tag });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports = {
  addTag,
  deleteTag,
  getAllTags,
  updateTag,
};
