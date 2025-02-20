const ContextMenu = ({ position, onActionClick }) => {
  return (
    <div
      className="absolute bg-white border rounded shadow-md context-menu"
      style={{ left: position.x, top: position.y }}
    >
      <ul>
        <li
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => onActionClick("View")}
        >
          View
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => onActionClick("Edit")}
        >
          Edit
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => onActionClick("Duplicate")}
        >
          Duplicate
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => onActionClick("Delete")}
        >
          Delete
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
