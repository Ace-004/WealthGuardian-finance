export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled,
  type = "button",
  className = "",
}) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

  const variants = {
    primary:
      "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 focus:ring-emerald-500/50",
    secondary:
      "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 focus:ring-slate-500/50",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 focus:ring-red-500/50",
    success:
      "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 focus:ring-emerald-500/50",
    outline:
      "bg-transparent text-emerald-400 border border-emerald-400/20 hover:bg-emerald-500/10 focus:ring-emerald-500/50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
