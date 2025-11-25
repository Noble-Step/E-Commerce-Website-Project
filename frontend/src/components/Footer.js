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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 md:pb-10 border-t border-yellow-600/20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 py-6 md:py-10">
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View our products"
                >
                  Our Products
                </button>
              </li>
            </ul>
          </div>

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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View delivery details"
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View terms and conditions"
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View privacy policy"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View account FAQ"
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View delivery FAQ"
                >
                  Manage Delivery
                </button>
              </li>
              <li>
                <a
                  href="/orders"
                  className="hover:text-yellow-500 transition-colors min-h-[44px] flex items-center"
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View payment FAQ"
                >
                  Payments
                </button>
              </li>
            </ul>
          </div>

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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View free eBooks information"
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View developments information"
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="Scroll to newsletter section"
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
                  className="hover:text-yellow-500 transition-colors text-left min-h-[44px]"
                  aria-label="View exclusive deals information"
                >
                  Exclusive Deals
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-yellow-600/20 pt-4 md:pt-6 text-gray-400 text-xs sm:text-sm gap-4 md:gap-0">
          <p className="text-center md:text-left">Noble Step © 2025, All rights reserved</p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-end">
            <button className="bg-white text-black font-semibold py-2 px-4 rounded flex items-center gap-1 hover:bg-yellow-500 hover:text-black transition-colors min-h-[44px]" aria-label="Visa payment method">
              <CreditCard size={16} aria-hidden="true" /> VISA
            </button>
            <button className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500 hover:text-black transition-colors min-h-[44px]" aria-label="PayPal payment method">
              PayPal
            </button>
            <button className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500 hover:text-black transition-colors min-h-[44px]" aria-label="Google Pay payment method">
              G Pay
            </button>
          </div>
        </div>
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
