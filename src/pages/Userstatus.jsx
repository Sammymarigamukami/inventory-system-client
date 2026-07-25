import React, { useEffect } from "react";
import TopNavbar from "../Components/TopNavbar";
import { useDispatch, useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import image from "../images/user.png";
import {
  staffUser,
  managerUser,
  adminUser,
  removeusers,
} from "../features/authSlice";
import toast from "react-hot-toast";
import UserRoleChart from "../lib/Usersgraph";

function Userstatus() {
  const { staffuser, manageruser, adminuser } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const fetchAllUsers = () => {
    dispatch(staffUser());
    dispatch(managerUser());
    dispatch(adminUser());
  };

  useEffect(() => {
    fetchAllUsers();
  }, [dispatch]);

  const handleRemove = (userId) => {
    dispatch(removeusers(userId))
      .unwrap()
      .then(() => {
        toast.success("User removed successfully");
        fetchAllUsers(); // Refresh list after deletion
      })
      .catch((err) => {
        toast.error(err || "Error removing user");
      });
  };

  const UserSection = ({ title, users }) => (
    <div className="bg-base-200 border border-base-300 p-4 rounded-2xl shadow-xs mb-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70">
        {title} ({users?.length || 0})
      </h2>
      {users?.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user._id || user.email}
              className="flex items-center justify-between p-2.5 bg-base-100 border border-base-300/60 rounded-xl transition-colors hover:border-base-300"
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <img
                  src={user?.ProfilePic || image}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-base-300"
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs opacity-60 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(user._id)}
                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                title="Remove User"
              >
                <TiDelete className="text-2xl" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs opacity-50 py-2">No users found in this role.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <TopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: User Role Management Lists */}
          <div className="w-full lg:w-96 shrink-0">
            <UserSection title="Managers" users={manageruser} />
            <UserSection title="Admins" users={adminuser} />
            <UserSection title="Staff" users={staffuser} />
          </div>

          {/* Right Column: User Distribution Chart */}
          <div className="w-full flex-1 bg-base-200 border border-base-300 p-6 rounded-2xl shadow-xs">
            <h2 className="text-lg font-bold mb-4">Role Analytics</h2>
            <div className="w-full overflow-hidden flex items-center justify-center">
              <UserRoleChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Userstatus;
