const Note = require("../models/noteModel");
const Bloc = require("../models/blocModel");

const addNote = async (req, res) => {
  try {
    const { blocId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const bloc = await Bloc.findById(blocId);
    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }
    const note = new Note({
      content,
      bloc: blocId,
      user: req.user._id,
    });
    await note.save();

    bloc.notes.push(note);
    await bloc.save();
    res.status(200).json({ message: "Note added with success", note });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const bloc = await Bloc.findById(note.bloc);
    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }

    // Remove the note from the bloc
    bloc.notes = bloc.notes.filter((note) => note.toString() !== noteId);
    await bloc.save();

    // Remove the note
    await Note.deleteOne({ _id: note._id });

    res.status(200).json({ message: "Note deleted with success" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error);
  }
};

const getNotesFromBloc = async (req, res) => {
  try {
    const { blocId } = req.params;
    const bloc = await Bloc.findById(blocId).populate({
      path: "notes",
      populate: {
        path: "user",
        model: "User",
      },
    });
    if (!bloc) {
      return res.status(404).json({ message: "Bloc not found" });
    }
    res.status(200).json({ notes: bloc.notes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { addNote, deleteNote, getNotesFromBloc };
