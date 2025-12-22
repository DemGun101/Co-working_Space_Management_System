import { io } from "../index";
import { AttendanceLog, GuestRequest, Order } from "../models";

export const calculateTodayStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalChai = await Order.countDocuments({
    requestedAt: { $gte: today },
    type: "chai",
  });

  const totalCoffee = await Order.countDocuments({
    requestedAt: { $gte: today },
    type: "coffee",
  });

  const guests = await GuestRequest.countDocuments({
    requestedAt: { $gte: today },
  });

  const checkIns = await AttendanceLog.countDocuments({
    checkInTime: { $gte: today },
  });

  const currentlyInOffice = await AttendanceLog.countDocuments({
    checkInTime: { $gte: today },
    checkOutTime: null,
  });

  return {
    totalChai,
    totalCoffee,
    guests,
    checkIns,
    currentlyInOffice,
  };
};

export const emitStatsUpdate = async () => {
  try {
    const stats = await calculateTodayStats();
    console.log("Emitting stats to /office-boy:", stats); // <-- Add this
    io.of("/office-boy").emit("stats-update", stats);
  } catch (error) {
    console.error("Error emitting stats:", error);
  }
};
