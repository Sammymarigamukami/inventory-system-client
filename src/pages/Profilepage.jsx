import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNavbar from "../Components/TopNavbar";
import { IoCameraOutline } from "react-icons/io5";
import image from "../images/user.png";
import { updateProfile } from "../features/authSlice";
import toast from "react-hot-toast";
import FormattedTime from "../lib/FormattedTime ";

function ProfilePage() {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);
  const { userdata } = useSelector((state) => state.activity);
  const [localImage, setLocalImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Safely extract logs array handling either flat array or nested array response structures
  const logs = Array.isArray(userdata)
    ? Array.isArray(userdata[0])
      ? userdata[0]
      : userdata
    : [];

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;

      try {
        const response = await dispatch(updateProfile(base64Image)).unwrap();
        toast.success("Profile picture updated successfully");
        setLocalImage(response?.updatedUser?.ProfilePic || base64Image);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(error || "Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Error reading file");
    };
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <TopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* User Profile Card */}
          <div className="w-full md:w-80 shrink-0 bg-base-200 border border-base-300 rounded-2xl p-6 shadow-xs flex flex-col items-center">
            {/* Avatar Container */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/80 shadow-md bg-base-100 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  src={localImage || Authuser?.ProfilePic || image}
                  alt={Authuser?.name || "Profile"}
                />
              </div>

              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="fileInput"
                className={`absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full cursor-pointer transition-colors shadow-lg ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Update Profile Picture"
              >
                <IoCameraOutline className="text-lg" />
              </label>
            </div>

            {/* Profile Info Details */}
            <div className="w-full space-y-4">
              <div className="border-b border-base-300 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block">
                  Name
                </span>
                <p className="font-semibold text-base truncate">
                  {Authuser?.name || "Guest User"}
                </p>
              </div>

              <div className="border-b border-base-300 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block">
                  Email
                </span>
                <p className="font-medium text-sm opacity-80 truncate">
                  {Authuser?.email || "guest@example.com"}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block">
                  Role
                </span>
                <span className="inline-block mt-1 px-3 py-1 bg-emerald-500/10 text-emerald-500 font-semibold text-xs rounded-full capitalize">
                  {Authuser?.role || "Staff"}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Logs Section */}
          <div className="w-full flex-1 bg-base-200 border border-base-300 rounded-2xl p-6 shadow-xs flex flex-col h-[520px]">
            <h2 className="text-lg font-bold mb-4 pb-3 border-b border-base-300 flex items-center justify-between">
              <span>Recent Activity Logs</span>
              <span className="text-xs font-normal opacity-60 font-mono">
                {logs.length} recorded
              </span>
            </h2>

            <div className="overflow-y-auto flex-1 pr-2 space-y-3">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div
                    key={log._id || index}
                    className="p-4 bg-base-100 border border-base-300/60 rounded-xl space-y-1.5 transition-colors hover:border-base-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm">{log.action}</h3>
                      <span className="text-xs opacity-60 font-mono shrink-0">
                        <FormattedTime timestamp={log.createdAt} />
                      </span>
                    </div>

                    {log.description && (
                      <p className="text-xs opacity-80">{log.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-60 pt-1 border-t border-base-300/40">
                      {log.entity && (
                        <p>
                          Affected Entity:{" "}
                          <span className="font-mono font-medium opacity-100">
                            {log.entity}
                          </span>
                        </p>
                      )}
                      {log.ipAddress && (
                        <p>
                          IP Address:{" "}
                          <span className="font-mono font-medium opacity-100">
                            {log.ipAddress}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center opacity-50 text-sm">
                  No activity logs available.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;