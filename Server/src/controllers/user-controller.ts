import { Request, Response } from 'express';
import { User, AttendanceLog, Order, GuestRequest } from "../models"
import { UserJwtPayload } from '../types/express';
import mongoose from 'mongoose';

// Toggle attendance (check-in/check-out)
export const toggleAttendance = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();

    // Get start and end of today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    if (user.isCheckedIn) {
      // Check-out: find the open attendance log and close it
      const openLog = await AttendanceLog.findOne({
        customerId: new mongoose.Types.ObjectId(userId),
        checkOutTime: null
      });

      if (openLog) {
        const hoursSpent = (now.getTime() - openLog.checkInTime.getTime()) / (1000 * 60 * 60);
        openLog.checkOutTime = now;
        openLog.hoursSpent = Math.round(hoursSpent * 100) / 100; // round to 2 decimals
        await openLog.save();
      }

      user.isCheckedIn = false;
      user.lastCheckOut = now;
      await user.save();

      return res.json({ message: 'Checked out successfully', isCheckedIn: false });
    } else {
      // Check if user already has a completed attendance log for today
      const todayLog = await AttendanceLog.findOne({
        customerId: new mongoose.Types.ObjectId(userId),
        checkInTime: { $gte: todayStart, $lte: todayEnd },
        checkOutTime: { $ne: null } // Already checked out
      });

      if (todayLog) {
        return res.status(400).json({
          message: 'You have already checked in and out today. Only one attendance per day is allowed.'
        });
      }

      // Check-in: create new attendance log
      await AttendanceLog.create({
        customerId: new mongoose.Types.ObjectId(userId),
        cabinNumber: user.cabinNumber,
        checkInTime: now,
        addedBy: 'customer'
      });

      user.isCheckedIn = true;
      user.lastCheckIn = now;
      await user.save();

      return res.json({ message: 'Checked in successfully', isCheckedIn: true });
    }
  } catch (error) {
    console.error('Error toggling attendance:', error);
    res.status(500).json({ message: 'Failed to toggle attendance' });
  }
};

// Get current logged-in user (secure - uses JWT token)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Extract userId from JWT token (set by authMiddleware)
    const userId = (req.user as UserJwtPayload)?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
}

// Create order (chai/coffee)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;
    const { type } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate order type
    if (!type || !['chai', 'coffee'].includes(type)) {
      return res.status(400).json({ message: 'Invalid order type. Must be "chai" or "coffee"' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is checked in
    if (!user.isCheckedIn) {
      return res.status(400).json({ message: 'You must be checked in to place an order' });
    }

    if (user.todayChaiCoffeeUsed >= 1) {
  return res.status(400).json({
    message: 'Limit reached for the day. You can only order 1 chai or coffee per day.'
  });
}

    const order = await Order.create({
      customerId: new mongoose.Types.ObjectId(userId),
      cabinNumber: user.cabinNumber,
      type,
      status: 'pending',
      requestedAt: new Date(),
      addedBy: 'customer'
    });
user.todayChaiCoffeeUsed = 1;
await user.save();
    return res.status(201).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} ordered successfully`,
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
}

export const registerGuest = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserJwtPayload)?.userId;
    const { guestName, expectedTime } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate required fields
    if (!guestName || !expectedTime) {
      return res.status(400).json({ message: 'Guest name and expected time are required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is checked in
    if (!user.isCheckedIn) {
      return res.status(400).json({ message: 'You must be checked in to register a guest' });
    }

    const guestRequest = await GuestRequest.create({
      customerId: new mongoose.Types.ObjectId(userId),
      cabinNumber: user.cabinNumber,
      guestName,
      expectedTime: new Date(expectedTime),
      status: 'pending',
      requestedAt: new Date(),
      addedBy: 'customer'
    });

    return res.status(201).json({
      message: 'Guest registered successfully',
      guestRequest
    });
  } catch (error) {
    console.error('Error registering guest:', error);
    res.status(500).json({ message: 'Failed to register guest' });
  }
}
