import React from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle";

// Not Found Page
const NotFoundPage = () => {
  usePageTitle("Page Not Found");
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-yellow-400 mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
