import { Types } from "mongoose";
import { History } from "../models/history";

// Helper to get today's date at midnight
const getTodayDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Get or create history record for a customer on a specific date
export const getOrCreateHistory = async (
  customerId: Types.ObjectId | string,
  cabinNumber: string,
  date?: Date
) => {
  const targetDate = date || getTodayDate();

  let history = await History.findOne({
    customerId,
    date: targetDate,
  });

  if (!history) {
    history = await History.create({
      customerId,
      date: targetDate,
      cabinNumber,
      attendance: {
        checkInTime: null,
        checkOutTime: null,
        totalHours: 0,
        checkedInBy: null,
      },
      order: {
        type: null,
        requestedAt: null,
        completedAt: null,
        status: null,
        orderedBy: null,
      },
      guests: [],
    });
  }

  return history;
};

// Update history when a new order is created
export const updateHistoryOnOrder = async (
  customerId: Types.ObjectId | string,
  cabinNumber: string,
  orderType: "chai" | "coffee",
  addedBy: "customer" | "office-boy"
) => {
  const history = await getOrCreateHistory(customerId, cabinNumber);

  history.order = {
    type: orderType,
    requestedAt: new Date(),
    completedAt: null,
    status: "pending",
    orderedBy: addedBy,
  };

  await history.save();
  return history;
};

// Update history when an order is completed
export const updateHistoryOnOrderComplete = async (
  customerId: Types.ObjectId | string,
  cabinNumber: string
) => {
  const today = getTodayDate();

  await History.findOneAndUpdate(
    { customerId, date: today },
    {
      "order.completedAt": new Date(),
      "order.status": "completed",
    }
  );
};

// Update history when a guest is registered
export const updateHistoryOnGuest = async (
  customerId: Types.ObjectId | string,
  cabinNumber: string,
  guestName: string,
  expectedTime: Date,
  addedBy: "customer" | "office-boy"
) => {
  const history = await getOrCreateHistory(customerId, cabinNumber);

  history.guests.push({
    guestName,
    expectedTime,
    status: "pending",
    requestedAt: new Date(),
    completedAt: null,
    registeredBy: addedBy,
  });

  await history.save();
  return history;
};

// Update history when a guest request is completed
export const updateHistoryOnGuestComplete = async (
  customerId: Types.ObjectId | string,
  guestName: string
) => {
  const today = getTodayDate();

  await History.findOneAndUpdate(
    {
      customerId,
      date: today,
      "guests.guestName": guestName,
      "guests.status": "pending",
    },
    {
      $set: {
        "guests.$.completedAt": new Date(),
        "guests.$.status": "completed",
      },
    }
  );
};

// Update history when check-in happens
export const updateHistoryOnCheckIn = async (
  customerId: Types.ObjectId | string,
  cabinNumber: string,
  addedBy: "customer" | "office-boy"
) => {
  const history = await getOrCreateHistory(customerId, cabinNumber);

  history.attendance = {
    checkInTime: new Date(),
    checkOutTime: null,
    totalHours: 0,
    checkedInBy: addedBy,
  };

  await history.save();
  return history;
};

// Update history when check-out happens
export const updateHistoryOnCheckOut = async (
  customerId: Types.ObjectId | string,
  cabinNumber: string,
  hoursSpent: number
) => {
  const today = getTodayDate();

  await History.findOneAndUpdate(
    { customerId, date: today },
    {
      "attendance.checkOutTime": new Date(),
      "attendance.totalHours": hoursSpent,
    }
  );
};
