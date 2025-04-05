"use client";
import { useEffect, useState } from "react";

export default function ErrorState({ error }: { error: string }) {
  {
    const [shake, setShake] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className={`mb-4 text-red-500 ${shake ? "animate-bounce" : ""}`}>
          <svg
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <div className="text-red-500 text-lg font-medium">Error: {error}</div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
}
