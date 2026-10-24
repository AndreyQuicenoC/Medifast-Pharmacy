export default function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-all ${className}`}
    >
      {children}
    </button>
  );
}
