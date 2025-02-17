const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-500 text-white rounded-md ${className}`}
  >
    {children}
  </button>
);

export default Button;
