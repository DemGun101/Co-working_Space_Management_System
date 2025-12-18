import { Request, Response } from "express";
import { User, AttendanceLog, Order, GuestRequest } from "../models";
import { UserJwtPayload } from "../types/express";

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Toggle attendance (check-in/check-out)
export const toggleAttendance = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.isCheckedIn) {
      // Check-out
      const openLog = await AttendanceLog.findOne({
        customerId: userId,
        checkOutTime: null,
      });

      if (openLog) {
        const hoursSpent =
          (now.getTime() - openLog.checkInTime.getTime()) / (1000 * 60 * 60);
        openLog.checkOutTime = now;
        openLog.hoursSpent = Math.round(hoursSpent * 100) / 100;
        await openLog.save();
      }

      user.isCheckedIn = false;
      user.lastCheckOut = now;
      await user.save();

      return res.json({
        message: "Checked out successfully",
        isCheckedIn: false,
      });
    } else {
      // // Check if already checked in/out today
      // const todayLog = await AttendanceLog.findOne({
      //   customerId: userId,
      //   checkInTime: { $gte: today },
      //   checkOutTime: { $ne: null }
      // });

      // if (todayLog) {
      //   return res.status(400).json({ message: 'Already checked in and out today' });
      // }

      // Check-in
      await AttendanceLog.create({
        customerId: userId,
        cabinNumber: user.cabinNumber,
        checkInTime: now,
        addedBy: "customer",
      });

      user.isCheckedIn = true;
      user.lastCheckIn = now;
      await user.save();

      return res.json({
        message: "Checked in successfully",
        isCheckedIn: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle attendance" });
  }
};

// Create order (chai/coffee)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;
    const { type } = req.body;

    if (!type || !["chai", "coffee"].includes(type)) {
      return res.status(400).json({ message: "Invalid order type" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isCheckedIn) {
      return res
        .status(400)
        .json({ message: "You must be checked in to order" });
    }

    if (user.todayChaiCoffeeUsed >= 1) {
      return res.status(400).json({ message: "Daily limit reached" });
    }

    const order = await Order.create({
      customerId: userId,
      cabinNumber: user.cabinNumber,
      type,
      status: "pending",
      requestedAt: new Date(),
      addedBy: "customer",
    });

    user.todayChaiCoffeeUsed = 1;
    await user.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Register guest
export const registerGuest = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;
    const { guestName, expectedTime } = req.body;

    if (!guestName || !expectedTime) {
      return res
        .status(400)
        .json({ message: "Guest name and expected time required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isCheckedIn) {
      return res
        .status(400)
        .json({ message: "You must be checked in to register a guest" });
    }

    const guestRequest = await GuestRequest.create({
      customerId: userId,
      cabinNumber: user.cabinNumber,
      guestName,
      expectedTime: new Date(expectedTime),
      status: "pending",
      requestedAt: new Date(),
      addedBy: "customer",
    });

    res.status(201).json({ message: "Guest registered", guestRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to register guest" });
  }
};
