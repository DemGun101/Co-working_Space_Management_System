import type { User } from "@/Api/auth";
import Header from "@/components/header";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import TodayStats from "./components/today-stats";
import ManualDropdown from "@/components/manual-dropdown";
import PendingSection from "./components/pending-section";
import CompletedSection from "./components/completed-section";
import { useEffect } from "react";
import { officeBoySocket } from "@/lib/socket";

const OfficeBoyDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user: User = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleLogout = () => {
    queryClient.clear();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };
  useEffect(() => {
    // console.log("Socket connected:", officeBoySocket.connected);

    // officeBoySocket.on("connect", () => {
    //   console.log("Office boy socket connected!");
    // });

    officeBoySocket.on("stats-update", (newStats) => {
      // console.log("Received stats:", newStats); // <-- Add this
      queryClient.setQueryData(["office-boy", "stats"], newStats);
    });

    return () => {
      officeBoySocket.off("stats-update");
      officeBoySocket.off("connect");
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <div className="max-w-4xl w-full mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <ManualDropdown />
          <TodayStats />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="md:col-span-2 bg-muted rounded-md p-4">
            <h2 className="font-semibold mb-3">Pending</h2>
            <PendingSection />
          </div>

          <div className="md:col-span-1 bg-muted rounded-md p-4">
            <h2 className="font-semibold mb-3">Completed</h2>
            <CompletedSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeBoyDashboard;
