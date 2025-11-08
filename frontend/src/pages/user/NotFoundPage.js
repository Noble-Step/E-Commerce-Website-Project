import React from 'react';

const NotFoundPage = ({ onNavigate }) => {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 leading-none">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-8">
          <svg className="w-32 h-32 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onNavigate?.('shop')}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            Go to Shop
          </button>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>

        {/* Additional Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 mb-4">You might want to check out:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate?.('shop')}
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              Shop
            </button>
            <span className="text-gray-700">•</span>
            <button 
              onClick={() => onNavigate?.('about')}
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              About Us
            </button>
            <span className="text-gray-700">•</span>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;