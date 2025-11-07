export default function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center z-40 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl border border-white/10 shadow-2xl p-8 min-w-[300px] relative">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="text-white">{children}</div>
      </div>
    </div>
  );
}
