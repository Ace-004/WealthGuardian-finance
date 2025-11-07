export default function Loader({ size = "md", fullScreen = false }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const dotsSize = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Spinning Circle with Gradient */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className={`${sizes[size]} relative`}>
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-emerald-500 via-emerald-400 to-emerald-300 opacity-20 blur-md animate-pulse"></div>

          {/* Main spinner */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-full rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-300 animate-spin"></div>
          </div>

          {/* Inner rotating circle */}
          <div className="absolute inset-2">
            <div className="absolute w-full h-full rounded-full border-3 border-transparent border-b-emerald-500 border-l-emerald-400 animate-spin-reverse"></div>
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Loading dots */}
      <div className="flex gap-2">
        <div
          className={`${dotsSize[size]} rounded-full bg-emerald-400 animate-bounce`}
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className={`${dotsSize[size]} rounded-full bg-emerald-400 animate-bounce`}
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className={`${dotsSize[size]} rounded-full bg-emerald-400 animate-bounce`}
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>

      {/* Loading text */}
      <div className="text-emerald-400 font-medium text-sm tracking-wider animate-pulse">
        Loading...
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50">
        <LoaderContent />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoaderContent />
    </div>
  );
}
