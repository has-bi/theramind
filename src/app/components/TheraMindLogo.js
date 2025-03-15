import React from "react";

const TheraMindLogo = ({ className = "" }) => {
  return (
    <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
    </div>
  );
};

export default TheraMindLogo;
