import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import { getAllActivityLogs, getsingleUserActivityLogs } from "../features/activitySlice";
import TopNavbar from "../Components/TopNavbar";
import FormattedTime from "../lib/FormattedTime ";

function Activitylogpage() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const { activityLogs } = useSelector((state) => state.activity);
  const { Authuser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const socket = getSocket();

  useEffect(() => {
    if (Authuser?.id) {
      dispatch(getAllActivityLogs());
      dispatch(getsingleUserActivityLogs(Authuser.id));
    }

    socket.on("newActivityLog", (newLog) => {
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    });

    return () => {
      socket.off("newActivityLog");
    };
  }, [dispatch, Authuser?.id, socket]);

  useEffect(() => {
    if (Array.isArray(activityLogs)) {
      setLogs(activityLogs);
    }
  }, [activityLogs]);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage) || 1;

  // Badge styling for common actions
  const getActionBadgeClass = (action = "") => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD")) {
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
    if (act.includes("UPDATE") || act.includes("EDIT")) {
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    }
    if (act.includes("DELETE") || act.includes("REMOVE")) {
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    }
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  };

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
              Activity Logs
            </h1>
            <p className="text-sm opacity-70 mt-1">Real-time system audit trails and user actions</p>
          </div>
        </div>

        {/* Logs Table Container */}
        <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-lg font-bold">Audit History</h2>
            <span className="text-xs font-mono opacity-60">Total Logs: {logs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/60 font-semibold opacity-80">
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Affected Part</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Time</th>
                  <th className="px-5 py-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {currentLogs.length > 0 ? (
                  currentLogs.map((log, index) => (
                    <tr key={log?._id || index} className="hover:bg-base-200/40 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs opacity-60">
                        {indexOfFirstLog + index + 1}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {log?.userId?.name || "System/Unknown"}
                      </td>
                      <td className="px-5 py-4 opacity-70">
                        {log?.userId?.email || "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionBadgeClass(log?.action)}`}>
                          {log?.action || "EVENT"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs opacity-80">
                        <span className="px-2 py-0.5 rounded bg-base-200 border border-base-300">
                          {log?.entity || "System"}
                        </span>
                      </td>
                      <td className="px-5 py-4 opacity-80 max-w-xs truncate" title={log?.description}>
                        {log?.description || "No details provided"}
                      </td>
                      <td className="px-5 py-4 opacity-70 text-xs whitespace-nowrap">
                        <FormattedTime timestamp={log?.createdAt} />
                      </td>
                      <td className="px-5 py-4 font-mono text-xs opacity-60">
                        {log?.ipAddress || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 opacity-50">
                      No activity logs available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="join border border-base-300 shadow-sm rounded-xl overflow-hidden bg-base-200/40">
              <button
                className="join-item btn btn-md border-none bg-transparent hover:bg-base-200 disabled:bg-transparent"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                « Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`join-item btn btn-md border-none ${
                    currentPage === index + 1
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold"
                      : "bg-transparent hover:bg-base-200"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="join-item btn btn-md border-none bg-transparent hover:bg-base-200 disabled:bg-transparent"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next »
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Activitylogpage;