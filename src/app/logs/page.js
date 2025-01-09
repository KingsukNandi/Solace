"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
// import { useAuth } from "../context/AuthContext";

const LogViewer = () => {
  // const { user } = useAuth();
  // if(!user){
  //   return <div>Not logged in</div>
  // }
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all"); // all, info, error, warn, debug
  const [search, setSearch] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLogs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    setLogs(storedLogs);

    const handleNewLog = (event) => {
      if (event.key === "app_logs") {
        setLogs(JSON.parse(event.newValue || "[]"));
      }
    };

    window.addEventListener("storage", handleNewLog);
    return () => window.removeEventListener("storage", handleNewLog);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return <div className="p-6">Loading...</div>;
  }

  const getLogIcon = (level) => {
    switch (level.toLowerCase()) {
      case "info":
        return <Icon icon="mdi:information" className="text-blue-500" />;
      case "error":
        return <Icon icon="mdi:alert-circle" className="text-red-500" />;
      case "warn":
        return <Icon icon="mdi:alert" className="text-yellow-500" />;
      case "debug":
        return <Icon icon="mdi:bug" className="text-green-500" />;
      default:
        return <Icon icon="mdi:circle-small" />;
    }
  };

  const filteredLogs = logs
    .filter((log) => filter === "all" || log.level === filter)
    .filter(
      (log) =>
        search === "" ||
        JSON.stringify(log).toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Application Logs</h1>

      <div className="mb-6 flex gap-4 items-center">
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="debug">Debug</option>
          </select>

          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 w-64"
          />
        </div>

        <button
          onClick={() => {
            localStorage.setItem("app_logs", "[]");
            setLogs([]);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No logs found</p>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-md shadow-sm border-l-4 hover:shadow-md transition-shadow"
                style={{
                  borderLeftColor:
                    log.level === "error"
                      ? "#ef4444"
                      : log.level === "warn"
                      ? "#f59e0b"
                      : log.level === "info"
                      ? "#3b82f6"
                      : "#10b981",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getLogIcon(log.level)}
                  <span className="font-medium">{log.context}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{log.message}</p>
                {log.data && (
                  <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
