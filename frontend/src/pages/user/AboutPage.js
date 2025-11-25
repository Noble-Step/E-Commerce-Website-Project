import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../utils/usePageTitle";
import { ChevronDown, ChevronUp } from "lucide-react";
import logo from "../../assets/logo.jpg";

// About Page
const AboutPage = () => {
  usePageTitle("About Us");
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What makes Noble Step shoes different from other brands?",
      answer: "Noble Step combines premium quality craftsmanship with modern style and exceptional comfort. We use only the finest materials and pay meticulous attention to detail in every pair of shoes we create, ensuring durability, style, and comfort in one package."
    },
    {
      question: "Where are Noble Step shoes manufactured?",
      answer: "Our shoes are crafted using premium materials sourced from ethical suppliers worldwide. We maintain strict quality control standards throughout our manufacturing process to ensure every pair meets our high standards of excellence."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer a hassle-free return and exchange policy. If you're not completely satisfied with your purchase, you can return or exchange your shoes within 30 days of purchase, provided they are in their original condition with tags attached."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship internationally to many countries. Shipping costs and delivery times vary by location. Please check our shipping information at checkout for details specific to your country."
    },
    {
      question: "How do I find the right size?",
      answer: "We provide a detailed size guide on our website to help you find the perfect fit. If you're unsure, our customer service team is happy to assist you in selecting the right size based on your measurements and preferences."
    },
    {
      question: "Are Noble Step shoes suitable for wide feet?",
      answer: "We offer various width options for many of our styles. Please check the product details for available widths, or contact our customer service team for assistance in finding the right fit for wide feet."
    },
    {
      question: "How do I care for my Noble Step shoes?",
      answer: "Care instructions vary by material. We provide specific care instructions with each purchase. Generally, leather shoes should be cleaned with a soft cloth and appropriate leather cleaner, and stored in a cool, dry place when not in use."
    },
    {
      question: "Do you offer gift wrapping or gift cards?",
      answer: "Yes, we offer gift wrapping services and gift cards are available for purchase. Gift cards can be used for any purchase on our website and never expire."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, and other secure payment methods. All transactions are processed securely to protect your information."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package's progress on our website or the carrier's website."
    },
    {
      question: "Do you have a physical store I can visit?",
      answer: "Yes! You can visit us at Robinsons Place Malolos, 2nd Floor, MacArthur Highway, Sumapang Matanda, Malolos City, Bulacan, Philippines. Our store hours and contact information are available on our website."
    },
    {
      question: "How can I contact customer service?",
      answer: "You can reach our customer service team via email at noblestep@gmail.com, phone at 0942-400-3373, or through our social media channels @NobleStepOfficial. We're here to help Monday through Saturday during business hours."
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4">
            About Us
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Crafting premium footwear that combines timeless style with modern
            comfort since 2020
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400">About Noble Step</h2>
            <p className="text-gray-300 leading-relaxed">
              Noble Step was founded with a passion for quality craftsmanship and a commitment to creating footwear that stands the test of time. We believe that every step you take should be a step toward confidence and excellence.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our journey began with a simple mission: to redefine modern footwear by combining quality craftsmanship with style and comfort. Each pair of shoes is carefully designed and constructed using premium materials sourced from ethical suppliers around the world.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Today, we're proud to serve thousands of customers who share our values of quality, integrity, and genuine dedication to customer satisfaction. We're committed to becoming a globally recognized footwear brand known for premium quality, timeless designs, and exceptional service.
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl aspect-square flex items-center justify-center">
            <img src={logo} alt="Noble Step" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To redefine modern footwear by combining quality craftsmanship with style and comfort, ensuring every step you take is a step toward confidence and excellence.
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              To become a globally recognized footwear brand known for premium quality, timeless designs, and genuine dedication to customer satisfaction.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <h3 className="text-xl font-bold mb-3">Craftsmanship</h3>
              <p className="text-gray-400">
                Every product is crafted with meticulous attention to detail and undergoes rigorous quality control to ensure exceptional durability and style.
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-gray-400">
                We conduct business with honesty, transparency, and ethical practices in all our operations and relationships.
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-400">
                We continuously innovate in design, materials, and manufacturing processes to deliver cutting-edge footwear solutions.
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
              <h3 className="text-xl font-bold mb-3">Customer Commitment</h3>
              <p className="text-gray-400">
                Your satisfaction is our priority. We're dedicated to providing exceptional service, support, and genuine care for every customer.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                30K+
              </div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                2,000+
              </div>
              <div className="text-gray-400">High-Quality Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">4.9</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">200+</div>
              <div className="text-gray-400">International Brands</div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              {
                name: "Jeffry Agustin",
                role: "Founder & CEO",
                color: "from-yellow-400 to-yellow-600",
              },
              {
                name: "Jolo Robles",
                role: "Founder & Technical Director",
                color: "from-blue-400 to-blue-600",
              },
              {
                name: "Paulo Delacruz",
                role: "Head Designer",
                color: "from-purple-400 to-purple-600",
              },
              {
                name: "Ej Deguzman",
                role: "Creative Director",
                color: "from-green-400 to-green-600",
              },
              {
                name: "Cherrie Roberto",
                role: "Marketing Director",
                color: "from-pink-400 to-pink-600",
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

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-800 transition-colors min-h-[60px]"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-semibold text-yellow-400 pr-4">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="text-yellow-400 flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-yellow-400 flex-shrink-0" size={20} />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  Visit Our Store
                </h3>
                <p className="text-gray-300">
                  Robinsons Place Malolos, 2nd Floor<br />
                  MacArthur Highway<br />
                  Sumapang Matanda, Malolos City<br />
                  Bulacan, Philippines
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  Phone
                </h3>
                <p className="text-gray-300">0942-400-3373</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  Email
                </h3>
                <p className="text-gray-300">
                  <a
                    href="mailto:noblestep@gmail.com"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    noblestep@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  Follow Us
                </h3>
                <p className="text-gray-300">
                  Facebook / Instagram:{" "}
                  <span className="text-yellow-400">@NobleStepOfficial</span>
                </p>
              </div>
            </div>
          </div>
        </div>

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

