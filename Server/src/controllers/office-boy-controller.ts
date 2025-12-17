import { Request, Response } from 'express';
import { Order, GuestRequest, AttendanceLog } from '../models';

// GET /office-boy/orders - Get all orders for today
export const getOrders = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      requestedAt: { $gte: today }
    }).sort({ requestedAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// GET /office-boy/guests - Get all guest requests for today
export const getGuestRequests = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const guests = await GuestRequest.find({
      requestedAt: { $gte: today }
    }).sort({ expectedTime: 1 });

    res.json(guests);
  } catch (error) {
    console.error('Error fetching guest requests:', error);
    res.status(500).json({ message: 'Failed to fetch guest requests' });
  }
};

// GET /office-boy/stats - Get today's stats
export const getTodayStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count chai orders
    const totalChai = await Order.countDocuments({
      requestedAt: { $gte: today },
      type: 'chai'
    });

    // Count coffee orders
    const totalCoffee = await Order.countDocuments({
      requestedAt: { $gte: today },
      type: 'coffee'
    });

    // Count guests
    const guests = await GuestRequest.countDocuments({
      requestedAt: { $gte: today }
    });

    // Count check-ins
    const checkIns = await AttendanceLog.countDocuments({
      checkInTime: { $gte: today }
    });

    // Count currently in office
    const currentlyInOffice = await AttendanceLog.countDocuments({
      checkInTime: { $gte: today },
      checkOutTime: null
    });

    res.json({
      totalChai,
      totalCoffee,
      guests,
      checkIns,
      currentlyInOffice
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// PATCH /office-boy/orders/:id/complete - Mark order as complete
export const completeOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order completed', order });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ message: 'Failed to complete order' });
  }
};

// PATCH /office-boy/guests/:id/complete - Mark guest request as complete
export const completeGuestRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const guestRequest = await GuestRequest.findByIdAndUpdate(
      id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );

    if (!guestRequest) {
      return res.status(404).json({ message: 'Guest request not found' });
    }

    res.json({ message: 'Guest request completed', guestRequest });
  } catch (error) {
    console.error('Error completing guest request:', error);
    res.status(500).json({ message: 'Failed to complete guest request' });
  }
};
