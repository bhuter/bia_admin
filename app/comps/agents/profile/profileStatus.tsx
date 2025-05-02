import React from "react";

interface ProfileStatusProps {
  completionPercentage: number; // Percentage of profile completion
}

const ProfileStatus: React.FC<ProfileStatusProps> = ({ completionPercentage }) => {
  const circleRadius = 40; // Radius of the circle
  const circleCircumference = 2 * Math.PI * circleRadius;

  // Calculate the stroke-dashoffset for the circle to represent progress
  const strokeDashoffset =
    circleCircumference - (completionPercentage / 100) * circleCircumference;

  return (
    <div className="flex bg-orange-300 text-white p-4 py-3 rounded-xl">
     <div className="flex justify-center items-center w-2/5">
        <svg
          width="100"
          height="100"
          viewBox="0 0 120 120"
          className="relative transform rotate-270"
        >
        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r={circleRadius}
          stroke="#FFF4" // Light gray
          strokeWidth="8"
          fill="none"
        />
          {/* Progress Circle */}
         <circle
          cx="60"
          cy="60"
          r={circleRadius}
          stroke="#FFF" // Indigo color
          strokeWidth="8"
          fill="none"
          strokeDasharray={circleCircumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          />
        </svg>
        <p className="absolute text-base text-slate-50">{completionPercentage}%</p>
      </div>
      <div className="px-2">
        <h1 className="text-white text-base font-medium"> Completed Profile</h1>
        <p className="text-slate-200 text-sm mt-3">Complete profile to unlock all features</p>
      </div>
    </div>
  );
};

export default ProfileStatus;
