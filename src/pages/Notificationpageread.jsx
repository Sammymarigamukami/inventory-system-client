import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotifications } from "../features/notificationSlice";
import { getSocket } from "../lib/socket";
import FormattedTime from "../lib/FormattedTime ";
import image from "../images/user.png";
import TopNavbar from "../Components/TopNavbar";
import { IoNotificationsOffOutline } from "react-icons/io5";

function NotificationPageRead() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const { Authuser } = useSelector((state) => state.auth);

  useEffect(() => {
    const socket = getSocket();

    dispatch(getAllNotifications());

    const handleNewNotification = () => {
      dispatch(getAllNotifications());
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      // Remove only this listener instead of killing the entire socket connection
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch]);

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-base-300">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm opacity-60 mt-1">
              Stay updated with your latest system activity and alerts
            </p>
          </div>
          {notifications?.length > 0 && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {notifications.length} Total
            </span>
          )}
        </div>

        <div className="space-y-3">
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                  notification.isRead
                    ? "bg-base-100 border-base-300 opacity-80"
                    : "bg-base-200/50 border-base-300 shadow-sm"
                }`}
              >
                <div className="relative">
                  <img
                    src={Authuser?.ProfilePic || image}
                    alt="User Avatar"
                    className="w-11 h-11 rounded-full object-cover border border-base-300"
                  />
                  {!notification.isRead && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-base-100" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm truncate">
                      {notification.name || "System Notification"}
                    </h3>
                    <span className="text-xs opacity-50 whitespace-nowrap">
                      <FormattedTime timestamp={notification.createdAt} />
                    </span>
                  </div>

                  <p className="text-sm opacity-80 mt-1 leading-relaxed">
                    {notification.type || notification.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-base-200/40 rounded-2xl border border-dashed border-base-300 text-center">
              <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-4 opacity-60">
                <IoNotificationsOffOutline className="text-2xl" />
              </div>
              <p className="font-medium text-base">No notifications yet</p>
              <p className="text-xs opacity-60 mt-1 max-w-xs">
                When you receive new alerts or updates, they will show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPageRead;