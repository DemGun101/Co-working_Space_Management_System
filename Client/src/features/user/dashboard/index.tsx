import type { User } from "@/Api/auth";
import Header from "@/components/header";
import { useNavigate } from "react-router-dom";
import {
  useCreateOrder,
  useGetMe,
  useRegisterGuest,
  useToggleAttendance,
} from "@/Api/user";
import Actions from "./components/actions";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import GuestModal from "./components/guest-modal";
import Activity from "./components/activity";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { data, refetch } = useGetMe();
  const { mutate: toggleAttendance } = useToggleAttendance();
  const { mutate: createOrder } = useCreateOrder();
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const { mutate: registerGuest } = useRegisterGuest();
  const handleCheckInOut = () => {
    toggleAttendance(undefined, {
      onSuccess: (res) => {
        refetch();
        toast.success(res.message);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to toggle attendance"
          );
        }
      },
    });
  };

  const handleOrderChai = () => {
    createOrder(
      { type: "chai" },
      {
        onSuccess: (res) => {
          refetch();
          toast.success(res.message);
        },
      }
    );
  };

  const handleOrderCoffee = () => {
    createOrder(
      { type: "coffee" },
      {
        onSuccess: (res) => {
          refetch();
          toast.success(res.message);
        },
      }
    );
  };
  const handleRegisterGuest = (data: {
    guestName: string;
    expectedTime: string;
  }) => {
    registerGuest(data, {
      onSuccess: () => refetch(),
    });
  };
  // Get user from localStorage
  const user: User = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
      <div className="flex px-6 mt-4 gap-4">
        <div className="p-4 bg-muted rounded-md h-fit">
          <p>Status: {data?.isCheckedIn ? "Checked In" : "Checked Out"}</p>
          <p>Today's Chai/Coffee: {data?.todayChaiCoffeeUsed ?? 0}</p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="max-w-md w-full">
            <Actions
              isCheckedIn={data?.isCheckedIn ?? false}
              onCheckInOut={handleCheckInOut}
              onChai={handleOrderChai}
              onCoffee={handleOrderCoffee}
              onGuest={() => setGuestModalOpen(true)}
            />
            <GuestModal
              open={guestModalOpen}
              onOpenChange={setGuestModalOpen}
              onSubmit={handleRegisterGuest}
            />
          </div>
        </div>
        <div className="w-64">
          <Activity
            lastCheckIn={data?.lastCheckIn}
            lastCheckOut={data?.lastCheckOut}
            todayChaiCoffeeUsed={data?.todayChaiCoffeeUsed ?? 0}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
