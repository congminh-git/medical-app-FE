import { useEffect, useState } from "react";

export default function PageFallback() {
const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.floor(Math.random() * 10 + 5);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="w-64 bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 text-blue-700 font-medium text-lg">
        Đang tải... {progress}%
      </div>
    </div>
  );
}