import React from "react";
import { useNavigate } from "react-router-dom";

// About Page
const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4">
            About Us
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Crafting premium footwear that combines timeless style with modern
            comfort since 2020
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              Founded with a passion for quality craftsmanship and sustainable
              fashion, we've dedicated ourselves to creating footwear that
              stands the test of time. Each pair of shoes is carefully designed
              and constructed using premium materials sourced from ethical
              suppliers around the world.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our journey began in a small workshop with a simple mission: to
              prove that style doesn't have to compromise comfort, and luxury
              doesn't have to sacrifice sustainability. Today, we're proud to
              serve thousands of customers who share our values.
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl aspect-square flex items-center justify-center">
            <svg
              className="w-48 h-48 text-black opacity-20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality First</h3>
              <p className="text-gray-400">
                Every product is crafted with meticulous attention to detail and
                undergoes rigorous quality control.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-gray-400">
                We're committed to reducing our environmental impact through
                eco-friendly materials and processes.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
              <p className="text-gray-400">
                Your satisfaction is our priority. We're here to provide
                exceptional service and support.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                50K+
              </div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                200+
              </div>
              <div className="text-gray-400">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">4.9</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">30+</div>
              <div className="text-gray-400">Countries</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                color: "from-yellow-400 to-yellow-600",
              },
              {
                name: "Michael Chen",
                role: "Head Designer",
                color: "from-blue-400 to-blue-600",
              },
              {
                name: "Emily Rodriguez",
                role: "Creative Director",
                color: "from-purple-400 to-purple-600",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-2xl p-6 text-center"
              >
                <div
                  className={`w-32 h-32 bg-gradient-to-br ${member.color} rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-black`}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-yellow-400 text-black rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Premium Quality?
          </h2>
          <p className="text-lg mb-8 opacity-80">
            Browse our collection and find your perfect pair today
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-yellow-400 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 transition text-lg"
          >
            Shop Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
