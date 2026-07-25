import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { login } from "../features/authSlice";
import homeImage from "../images/welcomeimage.webp";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function LoginPage() {
  const { Authuser, isUserLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle redirection whenever Authuser updates
  useEffect(() => {
    if (Authuser) {
      const userRole = (Authuser.role || Authuser.user?.role || "").toLowerCase();

      switch (userRole) {
        case "staff":
          navigate("/StaffDashboard");
          break;
        case "admin":
          navigate("/AdminDashboard");
          break;
        case "manager":
        default:
          navigate("/ManagerDashboard");
          break;
      }
    }
  }, [Authuser, navigate]);

  const onSubmit = (data) => {
    dispatch(login(data))
      .unwrap()
      .then((res) => {
        // Redirection is handled via the useEffect above
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col sm:flex-row transition-colors duration-300">
      {/* Left Column: Form Container */}
      <div className="w-full sm:w-1/2 p-6 sm:p-12 flex items-center justify-center bg-base-100">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">
              InventoryPro
            </h1>
            <p className="text-sm opacity-60 mt-1">
              by TechSolutions Inc.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 bg-base-200 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm"
              />
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-base-200 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm"
              />
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember/Terms Option */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded-md border-base-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs opacity-70 cursor-pointer"
              >
                Agree to terms and conditions
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUserLogin}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              {isUserLogin ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs opacity-70">
              Don't have an account?{" "}
              <Link
                to="/SignupPage"
                className="text-emerald-500 hover:underline font-semibold"
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Side Panel */}
      <div className="hidden sm:flex sm:w-1/2 bg-slate-950 p-12 text-white flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-80 h-80 bg-emerald-600/40 rounded-full blur-3xl"></div>
          <div className="w-60 h-60 bg-blue-600/40 rounded-full blur-3xl absolute top-1/4 left-1/4"></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Efficient Inventory Management
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Streamline your operations with real-time tracking, automated reports,
            and seamless integrations across all your retail locations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
