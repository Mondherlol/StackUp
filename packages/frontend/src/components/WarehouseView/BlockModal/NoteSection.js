"use client";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosConfig";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

const NotesSection = ({ blocId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      axiosInstance.get(`/note/${blocId}`).then((response) => {
        console.log("response", response);
        setNotes(response.data.notes);
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Error fetching notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [blocId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      let response = await axiosInstance.post(`/note/${blocId}`, {
        content: newNote,
      });

      if (response.status === 200) {
        setNotes([
          ...notes,
          {
            _id: response.data.note._id,
            content: newNote,
            user: user,
            createdAt: response.data.note.createdAt,
          },
        ]);
        setNewNote("");
        toast.success("Note added!");
      } else {
        toast.error("Failed to add note.");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Error adding note.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    try {
      let response = await axiosInstance.delete(`/note/${noteId}`);

      if (response.status === 200) {
        setNotes(notes.filter((note) => note._id !== noteId));
        toast.success("Note deleted!");
      } else {
        toast.error("Failed to delete note.");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold text-blue-600">Notes</h3>
      <div className="mt-2 space-y-4">
        {notes.map((note) => (
          <div key={note._id} className="flex items-start space-x-3 relative">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={`https://ui-avatars.com/api/?name=${note.user.username}`}
                alt={note.user.username}
              />
            </div>
            <div className="flex-1 bg-gray-100 p-3 rounded-lg shadow-sm">
              <div className="text-sm">
                <span className="font-semibold">
                  {note.user.username}
                  <span className="text-sm font-light text-gray-500 ml-2 ">
                    , {formatDate(note.createdAt)}
                  </span>
                </span>
                <p className="text-gray-700">{note.content}</p>
              </div>
            </div>

            {note.user._id == user._id && (
              <button
                className="absolute top-0 right-0 mt-2 mr-2 pr-3 pt-1 text-red-500"
                onClick={() => handleDeleteNote(note._id)}
              >
                <FaTrash color="red" />
              </button>
            )}
          </div>
        ))}

        {notes.length === 0 && (
          <div className="text-gray-500">
            No notes found. You can add a note for other users if needed.
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src={`https://ui-avatars.com/api/?name=${user.username}`}
            alt="CurrentUser"
          />
        </div>
        <div className="flex-1 flex flex-col items-end">
          <textarea
            className="w-full flex-1 p-2 border rounded"
            placeholder="Add your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onSubmit={handleAddNote}
          ></textarea>
          <button
            className="px-4 py-2 w-fit mt-1 bg-blue-600 text-white rounded"
            onClick={handleAddNote}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
