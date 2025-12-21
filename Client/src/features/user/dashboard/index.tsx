import type { User } from "@/Api/auth";
import Header from "@/components/header";
import { useNavigate } from "react-router-dom";
import {
  useCreateOrder,
  useGetMe,
  useGetActivity,
  useRegisterGuest,
  useToggleAttendance,
} from "@/Api/user";
import Actions from "./components/actions";
import { useState } from "react";
import GuestModal from "./components/guest-modal";
import Activity from "./components/activity";
import { useQueryClient } from "@tanstack/react-query";

const CustomerDashboard = () => {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data, refetch } = useGetMe();
  const { refetch: refetchActivity } = useGetActivity();
  const { mutate: toggleAttendance } = useToggleAttendance();
  const { mutate: createOrder } = useCreateOrder();
  const { mutate: registerGuest } = useRegisterGuest();
  const queryClient = useQueryClient();

  const handleCheckInOut = () => {
    toggleAttendance(undefined, {
      onSuccess: () => {
        refetch();
        refetchActivity();
      },
    });
  };

  const handleOrderChai = () => {
    createOrder(
      { type: "chai" },
      {
        onSuccess: () => {
          refetch();
          refetchActivity();
        },
      }
    );
  };

  const handleOrderCoffee = () => {
    createOrder(
      { type: "coffee" },
      {
        onSuccess: () => {
          refetch();
          refetchActivity();
        },
      }
    );
  };
  const handleRegisterGuest = (data: {
    guestName: string;
    expectedTime: string;
  }) => {
    registerGuest(data, {
      onSuccess: () => {
        refetch();
        refetchActivity();
      },
    });
  };

  const user: User = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleLogout = () => {
    queryClient.clear();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        onLogout={handleLogout}
        cabinNumber={data?.cabinNumber}
      />

      <div className="flex-1 flex flex-col items-center justify-center pt-5 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Status: {data?.isCheckedIn ? "Checked In" : "Checked Out"}</p>
            <p>Today's Chai/Coffee: {data?.todayChaiCoffeeUsed ?? 0}</p>
          </div>

          <Actions
            isCheckedIn={data?.isCheckedIn ?? false}
            chaiCoffeeLimitReached={(data?.todayChaiCoffeeUsed ?? 0) >= 1}
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

          <Activity />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
