"use client";
import { useEffect, useState } from "react";

export default function NotFoundState() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      } flex flex-col items-center justify-center min-h-screen w-full text-white`}
    >
      <div className="mb-4">
        <svg
          className="h-16 w-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
      </div>
      <div className="text-xl font-medium">University not found</div>
      <p className="mt-2 text-gray-300">
        We couldn't find the university you're looking for.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-white hover:bg-slate-400 text-black rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </div>
  );
}
