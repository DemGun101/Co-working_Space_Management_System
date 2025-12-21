import { Request, Response } from "express";
import { User, AttendanceLog, Order, GuestRequest } from "../models";
import { UserJwtPayload } from "../types/express";

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

export const toggleAttendance = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req.user as UserJwtPayload)?.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { customerId, action } = req.body;
    const isOfficeBoy = currentUser.role === 'office-boy';
    const targetUserId = isOfficeBoy && customerId ? customerId : currentUserId;
    const targetUser = isOfficeBoy && customerId
      ? await User.findById(customerId)
      : currentUser;

    if (!targetUser) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const addedBy = isOfficeBoy && customerId ? 'office-boy' : 'customer';

    const shouldCheckOut = isOfficeBoy && action
      ? action === 'check-out'
      : targetUser.isCheckedIn;

    if (shouldCheckOut) {
      const openLog = await AttendanceLog.findOne({
        customerId: targetUserId,
        checkOutTime: null,
      });

      if (openLog) {
        const hoursSpent =
          (now.getTime() - openLog.checkInTime.getTime()) / (1000 * 60 * 60);
        openLog.checkOutTime = now;
        openLog.hoursSpent = Math.round(hoursSpent * 100) / 100;
        await openLog.save();
      }

      targetUser.isCheckedIn = false;
      await targetUser.save();

      return res.json({
        message: "Checked out successfully",
        isCheckedIn: false,
      });
    } else {
      const todayLog = await AttendanceLog.findOne({
        customerId: targetUserId,
        checkInTime: { $gte: today },
        checkOutTime: { $ne: null }
      });

      if (todayLog && !isOfficeBoy) {
        return res.status(400).json({ message: 'Already checked in and out today' });
      }

      await AttendanceLog.create({
        customerId: targetUserId,
        cabinNumber: targetUser.cabinNumber,
        checkInTime: now,
        addedBy,
      });

      targetUser.isCheckedIn = true;
      await targetUser.save();

      return res.json({
        message: "Checked in successfully",
        isCheckedIn: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle attendance" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req.user as UserJwtPayload)?.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { type, customerId } = req.body;

    if (!type || !["chai", "coffee"].includes(type)) {
      return res.status(400).json({ message: "Invalid order type" });
    }

    const isOfficeBoy = currentUser.role === 'office-boy';
    const targetUserId = isOfficeBoy && customerId ? customerId : currentUserId;
    const targetUser = isOfficeBoy && customerId
      ? await User.findById(customerId)
      : currentUser;

    if (!targetUser) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!isOfficeBoy && !targetUser.isCheckedIn) {
      return res
        .status(400)
        .json({ message: "You must be checked in to order" });
    }

    if (targetUser.todayChaiCoffeeUsed >= 1) {
      return res.status(400).json({ message: "Daily limit reached" });
    }

    const addedBy = isOfficeBoy && customerId ? 'office-boy' : 'customer';

    const order = await Order.create({
      customerId: targetUserId,
      cabinNumber: targetUser.cabinNumber,
      type,
      status: "pending",
      requestedAt: new Date(),
      addedBy,
    });

    targetUser.todayChaiCoffeeUsed = 1;
    await targetUser.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const registerGuest = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req.user as UserJwtPayload)?.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { guestName, expectedTime, customerId } = req.body;

    if (!guestName || !expectedTime) {
      return res
        .status(400)
        .json({ message: "Guest name and expected time required" });
    }

    const isOfficeBoy = currentUser.role === 'office-boy';
    const targetUserId = isOfficeBoy && customerId ? customerId : currentUserId;
    const targetUser = isOfficeBoy && customerId
      ? await User.findById(customerId)
      : currentUser;

    if (!targetUser) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!isOfficeBoy && !targetUser.isCheckedIn) {
      return res
        .status(400)
        .json({ message: "You must be checked in to register a guest" });
    }

    const addedBy = isOfficeBoy && customerId ? 'office-boy' : 'customer';

    const guestRequest = await GuestRequest.create({
      customerId: targetUserId,
      cabinNumber: targetUser.cabinNumber,
      guestName,
      expectedTime: new Date(expectedTime),
      status: "pending",
      requestedAt: new Date(),
      addedBy,
    });

    res.status(201).json({ message: "Guest registered", guestRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to register guest" });
  }
};

export const getActivity = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const guests = await GuestRequest.find({
      customerId: userId,
      requestedAt: { $gte: today },
    }).sort({ requestedAt: -1 });

    const attendance = await AttendanceLog.findOne({
      customerId: userId,
      checkInTime: { $gte: today },
    });

    const order = await Order.findOne({
      customerId: userId,
      requestedAt: { $gte: today },
    });

    res.json({
      guests,
      attendance: attendance
        ? {
            checkInTime: attendance.checkInTime,
            checkOutTime: attendance.checkOutTime,
          }
        : null,
      order: order
        ? {
            type: order.type,
            requestedAt: order.requestedAt,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};
