import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Gettopproduct from "../lib/Gettopproduct";
import TopNavbar from "../Components/TopNavbar";
import { LuUsers, LuClock, LuActivity } from "react-icons/lu";
import { getrecentActivityLogs } from "../features/activitySlice";
import { staffUser, managerUser, adminUser } from "../features/authSlice";
import FormattedTime from "../lib/FormattedTime ";
import { getSocket } from "../lib/socket";

function Dashboardpage() {
  const { staffuser, manageruser, adminuser, Authuser } = useSelector(
    (state) => state.auth
  );
  const { recentuser } = useSelector((state) => state.activity);
  const dispatch = useDispatch();

  // Handle nested or flat Authuser state gracefully
  const userRole = (Authuser?.role || Authuser?.user?.role || "").toLowerCase();
  const userName = Authuser?.name || Authuser?.user?.name || userRole;

  useEffect(() => {
    const socket = getSocket();

    // Fetch activity logs for all roles
    dispatch(getrecentActivityLogs());

    // Fetch user lists
    dispatch(staffUser());
    dispatch(managerUser());
    dispatch(adminUser());

    const handleNewActivity = (newLog) => {
      console.log("New activity log:", newLog);
      dispatch(getrecentActivityLogs());
    };

    if (socket) {
      socket.on("newActivityLog", handleNewActivity);
    }

    return () => {
      if (socket) {
        socket.off("newActivityLog", handleNewActivity);
      }
    };
  }, [dispatch, Authuser?.role || ""]); // Explicitly defaults to a string value

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Welcome back, <span className="font-semibold capitalize">{userName}</span>
            </p>
          </div>
        </div>

        {/* User Count Stats Grid (Visible to all roles) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Staff Card */}
          <div className="p-6 rounded-2xl border border-base-300 bg-base-100 hover:bg-base-200/40 shadow-xs transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Staff Users
              </p>
              <h2 className="text-3xl font-bold mt-1 text-blue-500">
                {Array.isArray(staffuser) ? staffuser.length : 0}
              </h2>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
              <LuUsers className="text-3xl" />
            </div>
          </div>

          {/* Managers Card */}
          <div className="p-6 rounded-2xl border border-base-300 bg-base-100 hover:bg-base-200/40 shadow-xs transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Managers
              </p>
              <h2 className="text-3xl font-bold mt-1 text-emerald-500">
                {Array.isArray(manageruser) ? manageruser.length : 0}
              </h2>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500">
              <LuUsers className="text-3xl" />
            </div>
          </div>

          {/* Admins Card */}
          <div className="p-6 rounded-2xl border border-base-300 bg-base-100 hover:bg-base-200/40 shadow-xs transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Admins
              </p>
              <h2 className="text-3xl font-bold mt-1 text-rose-500">
                {Array.isArray(adminuser) ? adminuser.length : 0}
              </h2>
            </div>
            <div className="p-4 rounded-xl bg-rose-500/10 text-rose-500">
              <LuUsers className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Top Products Section */}
        <div className="mb-12">
          <Gettopproduct />
        </div>

        {/* Recent Activity Section */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <span className="text-xs opacity-60 font-mono">Live updates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(recentuser) && recentuser.length > 0 ? (
              recentuser.map((logs) => (
                <div
                  key={logs?._id}
                  className="p-5 rounded-xl border border-base-300 bg-base-200/40 hover:border-emerald-500/30 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                      <LuActivity className="text-xl" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-semibold truncate">
                        {logs?.userId?.name || logs?.name || "Unknown User"}
                      </h3>
                      <p className="text-xs opacity-70 mt-0.5 capitalize line-clamp-2">
                        {logs?.action || "Action performed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs opacity-60 border-t border-base-300/60 pt-3">
                    <LuClock className="text-sm shrink-0" />
                    <FormattedTime timestamp={logs?.createdAt} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 opacity-50 text-sm">
                No recent activity logs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboardpage;