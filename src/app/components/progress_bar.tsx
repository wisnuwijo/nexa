import React from "react";

interface ProgressBarProps {
  progress: number; // 0 - 100
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="h-4 bg-purple-600 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
