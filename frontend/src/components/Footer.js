import React, { useState } from "react";
import { Facebook, Twitter, Instagram, CreditCard } from "lucide-react";
import AlertModal from "../modals/AlertModal";

// Footer
export default function Footer() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const openInfo = (title, message) => {
    setAlertConfig({ type: "info", title, message });
    setShowAlert(true);
  };
  return (
    <footer className="bg-black text-white border-t border-yellow-600/20">
      <div className="max-w-7xl mx-auto px-6 pb-10 border-t border-yellow-600/20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-10">
          {/* Logo and Description */}
          <div>
            <h2 className="text-yellow-500 font-semibold text-xl mb-3">
              Noble Step
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              We have shoes that suit your style and that you're proud to wear.
              From women to men.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 bg-neutral-900 flex items-center justify-center rounded-full hover:bg-yellow-600 hover:text-black transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 bg-neutral-900 flex items-center justify-center rounded-full hover:bg-yellow-600 hover:text-black transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-neutral-900 flex items-center justify-center rounded-full hover:bg-yellow-600 hover:text-black transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-200">
              COMPANY
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href="/about"
                  className="hover:text-yellow-500 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Shop
                </a>
              </li>
              <li>
                <button
                  onClick={() => (window.location.href = "/shop")}
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Our Products
                </button>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-200">HELP</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href="/contact"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Customer Support
                </a>
              </li>
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Delivery Details",
                      "Free shipping on orders over $200. Standard shipping fee: $15"
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Delivery Details
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Terms & Conditions",
                      "All products are subject to availability. Returns accepted within 30 days."
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Privacy Policy",
                      "We respect your privacy and protect your personal information."
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-200">FAQ</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Account FAQ",
                      "You can create an account to save your preferences and order history."
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Account
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Delivery FAQ",
                      "We offer free shipping on orders over $200. Standard delivery takes 3-5 business days."
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Manage Delivery
                </button>
              </li>
              <li>
                <a
                  href="/orders"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Orders
                </a>
              </li>
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Payment FAQ",
                      "We accept Visa, PayPal, and Google Pay. All payments are secure and encrypted."
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Payments
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-200">
              RESOURCES
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Free eBooks",
                      "Coming soon! Subscribe to our newsletter for updates."
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Free eBooks
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Developments",
                      "New products and features are added regularly. Check back often!"
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Developments
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    window.scrollTo({
                      top:
                        document.querySelector("section:last-of-type")
                          ?.offsetTop || 0,
                      behavior: "smooth",
                    })
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Join Our Newsletter
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openInfo(
                      "Exclusive Deals",
                      "Subscribe to our newsletter for exclusive deals and early access to sales!"
                    )
                  }
                  className="hover:text-yellow-500 transition-colors text-left"
                >
                  Exclusive Deals
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-yellow-600/20 pt-6 text-gray-400 text-sm">
          <p>Noble Step © 2025, All rights reserved</p>
          <div className="flex gap-3 mt-3 md:mt-0">
            <button className="bg-white text-black font-semibold py-1 px-3 rounded flex items-center gap-1 hover:bg-yellow-500 hover:text-black transition-colors">
              <CreditCard size={16} /> VISA
            </button>
            <button className="bg-white text-black font-semibold py-1 px-3 rounded hover:bg-yellow-500 hover:text-black transition-colors">
              PayPal
            </button>
            <button className="bg-white text-black font-semibold py-1 px-3 rounded hover:bg-yellow-500 hover:text-black transition-colors">
              G Pay
            </button>
          </div>
        </div>
        {/* Alert Modal */}
        {alertConfig && (
          <AlertModal
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            {...alertConfig}
          />
        )}
      </div>
    </footer>
  );
}
