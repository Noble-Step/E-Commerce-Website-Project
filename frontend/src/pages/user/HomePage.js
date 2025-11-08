import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import shoeImage from "../../assets/shoe.png";
import sneakers from "../../assets/sneakers.png";
import runners from "../../assets/runners.png";
import oxford from "../../assets/oxford.png";
import boots from "../../assets/boots.png";
import casualImg from "../../assets/sneakers.png";
import formalImg from "../../assets/runners.png";
import athleticImg from "../../assets/oxford.png";
import bootsImg from "../../assets/boots.png";

// Home Page
export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterError("");

    if (!email.trim()) {
      setNewsletterError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setNewsletterError("Please enter a valid email address");
      return;
    }

    console.log("Newsletter subscription:", email);
    setNewsletterSuccess(true);
    setEmail("");

    setTimeout(() => {
      setNewsletterSuccess(false);
    }, 5000);
  };

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex flex-col md:flex-row justify-between items-center px-10 md:px-20 py-20 flex-1">
        {/* Left side */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            FIND SHOES THAT MATCHES YOUR STYLE
          </h1>
          <p className="text-gray-400">
            Browse through our diverse range of meticulously crafted footwear,
            from elegant dress shoes to high-performance athletic wear, designed
            to elevate your every step.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition"
          >
            Shop Now
          </Link>

          <div className="flex justify-between border-t border-gray-700 pt-6 mt-8">
            <div className="text-center">
              <p className="text-xl font-semibold text-yellow-500">200+</p>
              <p className="text-sm text-gray-400">International Brands</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-yellow-500">2,000+</p>
              <p className="text-sm text-gray-400">High-Quality Products</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-yellow-500">30,000+</p>
              <p className="text-sm text-gray-400">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="relative mt-10 md:mt-0">
          <img
            src={shoeImage}
            alt="Elegant Shoe"
            className="w-[350px] md:w-[450px] rounded-3xl"
          />
          <span className="absolute top-4 left-4 bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
            Elegant
          </span>
        </div>
      </main>

      {/* Top Selling Section */}
      <section className="px-10 md:px-20 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-10 text-yellow-500">
          TOP SELLING
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Product 1 */}
          <div
            onClick={() => navigate("/product/1")}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition"
          >
            <img
              src={sneakers}
              alt="Luxury Sneakers"
              className="w-full h-60 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-medium">Luxury Sneakers – White</h3>
              <p className="text-yellow-400 text-sm mt-1">★★★★☆ 4.0/5</p>
              <p className="mt-2 font-semibold text-yellow-500">$260</p>
            </div>
          </div>

          {/* Product 2 */}
          <div
            onClick={() => navigate("/product/2")}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition"
          >
            <img
              src={runners}
              alt="Sport Runners"
              className="w-full h-60 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-medium">Sport Runners – Multi</h3>
              <p className="text-yellow-400 text-sm mt-1">★★★★★ 5.0/5</p>
              <p className="mt-2 font-semibold text-yellow-500">$180</p>
            </div>
          </div>

          {/* Product 3 */}
          <div
            onClick={() => navigate("/product/3")}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition"
          >
            <img
              src={oxford}
              alt="Formal Oxford"
              className="w-full h-60 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-medium">Formal Oxford – Brown</h3>
              <p className="text-yellow-400 text-sm mt-1">★★★★★ 5.0/5</p>
              <p className="mt-2 font-semibold text-yellow-500">$320</p>
            </div>
          </div>

          {/* Product 4 */}
          <div
            onClick={() => navigate("/product/4")}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition"
          >
            <img
              src={boots}
              alt="Classic Boots"
              className="w-full h-60 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-medium">Classic Boots – Black</h3>
              <p className="text-yellow-400 text-sm mt-1">★★★★★ 5.0/5</p>
              <p className="mt-2 font-semibold text-yellow-500">$290</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="px-10 md:px-20 pb-20 text-center">
        <h2 className="text-2xl font-semibold mb-10 text-yellow-500">
          OUR HAPPY CUSTOMERS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left">
            <p className="text-yellow-400 text-lg mb-2">★★★★★</p>
            <p className="italic text-gray-300">
              “I'm blown away by the quality and style of the shoes I received
              from Noble Step. The attention to detail and premium materials are
              exceptional!”
            </p>
            <p className="mt-4 font-semibold text-yellow-500">Sarah M.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left">
            <p className="text-yellow-400 text-lg mb-2">★★★★★</p>
            <p className="italic text-gray-300">
              “Finding shoes that perfectly match my style was never easy until
              I discovered Noble Step. The luxury collection is unmatched!”
            </p>
            <p className="mt-4 font-semibold text-yellow-500">Alex K.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left">
            <p className="text-yellow-400 text-lg mb-2">★★★★★</p>
            <p className="italic text-gray-300">
              “The craftsmanship and comfort of these shoes are outstanding.
              I’ve received so many compliments. Highly recommend Noble Step!”
            </p>
            <p className="mt-4 font-semibold text-yellow-500">James L.</p>
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="flex flex-col items-center py-12 px-6 md:px-20">
        <h2 className="w-full text-2xl text-center md:text-3xl font-semibold tracking-wide bg-gradient-to-r from-gray-200 to-gray-400 text-transparent bg-clip-text uppercase mb-8 border border-gray-600 rounded-full px-8 py-3">
          Browse by Shoe Styles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Formal */}
          <div
            onClick={() => navigate("/shop?category=formal")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={formalImg}
              alt="Formal"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Formal
            </div>
          </div>

          {/* Casual */}
          <div
            onClick={() => navigate("/shop?category=casual")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={casualImg}
              alt="Casual"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Casual
            </div>
          </div>

          {/* Athletic */}
          <div
            onClick={() => navigate("/shop?category=athletic")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={athleticImg}
              alt="Athletic"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Athletic
            </div>
          </div>

          {/* Boots & Open Footwear */}
          <div
            onClick={() => navigate("/shop?category=boots")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={bootsImg}
              alt="Boots & Open Footwear"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Boots & Open Footwear
            </div>
          </div>
        </div>
      </section>

      {/* Brand Banner Section */}
      <section className="bg-[#d4af37] py-4 flex flex-wrap justify-center items-center gap-8 text-black font-medium tracking-wide">
        <span
          onClick={() => navigate("/shop?brand=versace")}
          className="hover:underline cursor-pointer"
        >
          VERSACE
        </span>
        <span
          onClick={() => navigate("/shop?brand=zara")}
          className="hover:underline cursor-pointer"
        >
          ZARA
        </span>
        <span
          onClick={() => navigate("/shop?brand=gucci")}
          className="hover:underline cursor-pointer"
        >
          GUCCI
        </span>
        <span
          onClick={() => navigate("/shop?brand=prada")}
          className="hover:underline cursor-pointer"
        >
          PRADA
        </span>
        <span
          onClick={() => navigate("/shop?brand=calvin-klein")}
          className="hover:underline cursor-pointer"
        >
          Calvin Klein
        </span>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white flex justify-center py-12">
        <div className="flex flex-row space-x-10 bg-[#111] rounded-2xl shadow-md p-8 w-[90%] max-w-4xl">
          <div className="flex items-center justify-center">
            <h2 className="text-2xl font-semibold">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h2>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col gap-4"
          >
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setNewsletterError("");
                  setNewsletterSuccess(false);
                }}
                placeholder="Enter your email address"
                className={`px-4 py-3 rounded-full w-full text-black outline-none focus:ring-2 ${
                  newsletterError
                    ? "focus:ring-red-500 border-2 border-red-500"
                    : "focus:ring-[#d4af37]"
                }`}
              />
              {newsletterError && (
                <p className="text-red-400 text-xs mt-1 ml-2">
                  {newsletterError}
                </p>
              )}
              {newsletterSuccess && (
                <p className="text-green-400 text-xs mt-1 ml-2">
                  Successfully subscribed! Thank you.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-white text-black font-medium rounded-full px-6 py-3 hover:bg-[#d4af37] hover:text-white transition-all duration-200"
            >
              Subscribe to Newsletter
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
