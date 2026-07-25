import React, { useState } from "react";
import { FaArrowRightLong, FaPlus, FaMinus } from "react-icons/fa6";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "What is this platform about?",
    answer:
      "Our platform provides AI-driven inventory management and CRM solutions designed to streamline business operations and enhance productivity.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a 14-day free trial with full access to all core features.",
  },
  {
    question: "Can I integrate this with other tools?",
    answer:
      "Absolutely! Our platform supports integration with various third-party tools, including ERP systems and payment gateways.",
  },
];

function HomePage() {
  const [arrowShow, setArrowShow] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col justify-between overflow-x-hidden transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-purple-500/20 blur-3xl"></div>
        </div>

        <div className="text-center max-w-3xl relative z-10 space-y-8">
          {/* Badge Heading */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold tracking-wide uppercase">
            <span>✧</span> Modern & Scalable
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Comprehensive Inventory Management Tools
          </h1>

          <p className="text-base sm:text-lg opacity-75 max-w-2xl mx-auto leading-relaxed">
            Experience the perfect blend of power and simplicity. Connect your
            data, teams, and customers with an automated platform that scales
            alongside your business.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/SignupPage"
              onMouseEnter={() => setArrowShow(true)}
              onMouseLeave={() => setArrowShow(false)}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              Get Started Free
              <FaArrowRightLong
                className={`transition-transform duration-200 ${
                  arrowShow ? "translate-x-1" : ""
                }`}
              />
            </Link>
            <Link
              to="/LoginPage"
              className="w-full sm:w-auto px-6 py-3.5 bg-base-200 hover:bg-base-300 font-medium text-sm rounded-xl transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="border-t border-base-300 my-10"></div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div className="bg-base-200 border border-base-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-1 shadow-xs hover:border-emerald-500/40 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Customer Satisfaction
              </span>
              <span className="text-3xl font-extrabold text-emerald-500">
                70%
              </span>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-1 shadow-xs hover:border-emerald-500/40 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Management Efficiency
              </span>
              <span className="text-3xl font-extrabold text-emerald-500">
                60%
              </span>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-1 shadow-xs hover:border-emerald-500/40 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Workload Decrease
              </span>
              <span className="text-3xl font-extrabold text-emerald-500">
                50%
              </span>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="max-w-2xl mx-auto text-left pt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-center sm:text-left">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {FAQS.map((faq, index) => (
                <div
                  key={index}
                  className="bg-base-200 border border-base-300 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    className="flex items-center justify-between w-full p-4 text-left font-semibold text-sm sm:text-base focus:outline-hidden"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    {openFAQ === index ? (
                      <FaMinus className="text-emerald-500 shrink-0 ml-2" />
                    ) : (
                      <FaPlus className="text-emerald-500 shrink-0 ml-2" />
                    )}
                  </button>

                  {openFAQ === index && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm opacity-75 leading-relaxed border-t border-base-300/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;