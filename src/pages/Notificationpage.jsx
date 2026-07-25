import React, { useEffect, useState } from "react";
import TopNavbar from "../Components/TopNavbar";
import { IoMdAdd } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import defaultUserImg from "../images/user.png";
import {
  createNotification,
  getAllNotifications,
  deleteNotification,
} from "../features/notificationSlice";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";
import FormattedTime from "../lib/FormattedTime ";

function NotificationPage() {
  const dispatch = useDispatch();
  const { notifications = [] } = useSelector((state) => state.notification);
  const { Authuser } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    dispatch(getAllNotifications());

    const handleNewNotification = (newNotification) => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl shadow-lg bg-base-200 border border-base-300 text-base-content ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}
          >
            <img
              src={Authuser?.ProfilePic || defaultUserImg}
              alt="Notification sender"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {newNotification.name}
              </p>
              <p className="text-xs opacity-75 line-clamp-2">
                {newNotification.type}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-sm opacity-50 hover:opacity-100 p-1 cursor-pointer"
              aria-label="Close toast"
            >
              &times;
            </button>
          </div>
        ),
        {
          duration: 4000,
          position: "top-right",
        }
      );
      dispatch(getAllNotifications());
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch, Authuser?.ProfilePic]);

  const resetForm = () => {
    setName("");
    setType("");
  };

  const submitNotification = async (event) => {
    event.preventDefault();
    if (!name.trim() || !type.trim()) return;

    setIsSubmitting(true);
    const notificationData = { name, type };

    dispatch(createNotification(notificationData))
      .unwrap()
      .then(() => {
        toast.success("Notification added successfully");
        resetForm();
        setIsFormVisible(false);
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to add notification");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id))
      .unwrap()
      .then(() => {
        toast.success("Notification removed");
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to delete notification");
      });
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen transition-colors duration-300 pb-12">
      <TopNavbar />

      <main className="max-w-3xl mx-auto px-4 mt-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-xs opacity-60">
              Manage broadcast messages and account alerts
            </p>
          </div>
          <button
            onClick={() => setIsFormVisible((prev) => !prev)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer shadow-xs"
          >
            <IoMdAdd className="text-lg" /> Add Notification
          </button>
        </div>

        {/* Modal/Form Container */}
        {isFormVisible && (
          <div className="p-6 rounded-2xl bg-base-200 border border-base-300 shadow-sm mb-6 transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">New Notification</h2>
              <button
                onClick={() => setIsFormVisible(false)}
                className="opacity-60 hover:opacity-100 transition-opacity p-1"
                aria-label="Close form"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <form onSubmit={submitNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  Title
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm"
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  Description
                </label>
                <textarea
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-24 px-3 py-2 bg-base-100 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm resize-none"
                  placeholder="Enter notification message"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="px-4 py-2 bg-base-300 hover:bg-base-100 text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? "Posting..." : "Publish Notification"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-start gap-4 bg-base-200 border border-base-300 p-4 rounded-2xl hover:border-emerald-500/30 transition-all shadow-xs"
              >
                <img
                  src={Authuser?.ProfilePic || defaultUserImg}
                  alt="User"
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-base-300 mt-0.5"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold tracking-tight">
                    {notification.name}
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5 leading-relaxed break-words">
                    {notification.type}
                  </p>
                  <div className="text-[10px] opacity-50 mt-2 font-mono">
                    <FormattedTime timestamp={notification.createdAt} />
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(notification._id)}
                  className="opacity-40 hover:opacity-100 text-rose-500 transition-opacity p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                  aria-label="Delete notification"
                >
                  <MdClose className="text-lg" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center bg-base-200 border border-base-300 rounded-2xl py-12 px-4">
              <p className="text-sm opacity-60">No notifications found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NotificationPage;