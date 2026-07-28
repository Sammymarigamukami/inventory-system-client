import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../features/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup.string().required("Role is required"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

function SignupPage() {
  const { Authuser, isUserSignup } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "staff",
      terms: false,
    },
  });

  // Redirect automatically when Authuser is updated
  useEffect(() => {
    if (Authuser?.role) {
      const roleRouteMap = {
        admin: "/AdminDashboard",
        manager: "/ManagerDashboard",
        staff: "/StaffDashboard",
      };
      navigate(roleRouteMap[Authuser.role.toLowerCase()] || "/StaffDashboard");
    }
  }, [Authuser, navigate]);

  const onSubmit = (data) => {
    const { terms, ...payload } = data;
    console.log("Form Data:", payload);
    console.log("Terms Accepted:", terms);
    console.log("data", data);
    dispatch(signup(payload)).catch((error) => {
      console.error("Signup failed:", error);
    });
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col md:flex-row transition-colors duration-300">
      {/* Left Column: Form Section */}
      <div className="w-full md:w-1/2 p-6 sm:p-12 flex items-center justify-center bg-base-100">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">
              InventoryPro
            </h1>
            <p className="text-sm opacity-60 mt-1">
              by TechSolutions Inc.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="John Doe"
                className="w-full px-3 py-2.5 bg-base-200 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm"
              />
              {errors.name && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
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

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1"
              >
                Password
              </label>
              <input
                id="password"
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

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className="w-full px-3 py-2.5 bg-base-200 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm cursor-pointer"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="w-4 h-4 rounded-md border-base-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs opacity-70 cursor-pointer"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.terms && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUserSignup}
              className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              {isUserSignup ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs opacity-70">
              Already have an account?{" "}
              <Link
                to="/LoginPage"
                className="text-emerald-500 hover:underline font-semibold"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Showcase */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 p-12 text-white flex-col justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <div className="w-80 h-80 bg-emerald-600/30 rounded-full blur-3xl"></div>
          <div className="w-60 h-60 bg-blue-600/30 rounded-full blur-3xl absolute top-1/4 left-1/4"></div>
          <div className="w-48 h-48 bg-purple-600/30 rounded-full blur-3xl absolute bottom-1/4 right-1/4"></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Efficient Inventory Management
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Streamline your operations with real-time tracking, automated reports,
            and seamless role-based workflows across all your store locations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;