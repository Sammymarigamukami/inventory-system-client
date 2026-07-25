import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Overview */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight">
            InventoryPro
          </h2>
          <p className="text-sm opacity-75 leading-relaxed">
            Efficient Inventory Management, Simplified.
          </p>
          <p className="text-xs opacity-50 pt-2 font-mono">
            © {new Date().getFullYear()} InventoryPro. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/HomePage"
                className="opacity-75 hover:opacity-100 hover:text-emerald-500 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/LoginPage"
                className="opacity-75 hover:opacity-100 hover:text-emerald-500 transition-colors"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/SignupPage"
                className="opacity-75 hover:opacity-100 hover:text-emerald-500 transition-colors"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/NotificationPage"
                className="opacity-75 hover:opacity-100 hover:text-emerald-500 transition-colors"
              >
                Notifications
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info & Socials */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-4">
            Contact Us
          </h3>
          <div className="space-y-1.5 text-sm opacity-75">
            <p>
              Email:{" "}
              <a
                href="mailto:support@inventorypro.com"
                className="hover:underline hover:text-emerald-500"
              >
                support@inventorypro.com
              </a>
            </p>
            <p>Phone: 022-338-983-902</p>
            <p>Address: 123 Inventory St, Tech City</p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-5 text-lg">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="opacity-60 hover:opacity-100 hover:text-emerald-500 transition-colors"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="opacity-60 hover:opacity-100 hover:text-emerald-500 transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="opacity-60 hover:opacity-100 hover:text-emerald-500 transition-colors"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="opacity-60 hover:opacity-100 hover:text-emerald-500 transition-colors"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
