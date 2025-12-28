import { Request, Response } from 'express';
import { Order, GuestRequest, AttendanceLog, User, History } from '../models';

// GET /admin/dashboard/filters - Get filter options (cabins and customers)
export const getFilterOptions = async (req: Request, res: Response) => {
    try {
        const [cabins, customers] = await Promise.all([
            User.distinct('cabinNumber', { cabinNumber: { $ne: '', $exists: true } }),
            User.find({ role: 'customer' }).select('_id name cabinNumber').sort({ name: 1 })
        ]);

        res.status(200).json({
            cabins: cabins.filter(Boolean).sort(),
            customers: customers.map(c => ({
                _id: c._id,
                name: c.name,
                cabinNumber: c.cabinNumber
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET /admin/dashboard/stats - Overview stats
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Today's stats
        const todayStats = await Promise.all([
            Order.countDocuments({ requestedAt: { $gte: today }, type: 'chai' }),
            Order.countDocuments({ requestedAt: { $gte: today }, type: 'coffee' }),
            GuestRequest.countDocuments({ requestedAt: { $gte: today } }),
            AttendanceLog.countDocuments({ checkInTime: { $gte: today } }),
            AttendanceLog.countDocuments({ checkInTime: { $gte: today }, checkOutTime: null }),
            Order.countDocuments({ requestedAt: { $gte: today }, status: 'pending' }),
            GuestRequest.countDocuments({ requestedAt: { $gte: today }, status: 'pending' })
        ]);

        // Total counts
        const totalStats = await Promise.all([
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'office-boy' }),
            User.countDocuments()
        ]);

        res.status(200).json({
            today: {
                totalChai: todayStats[0],
                totalCoffee: todayStats[1],
                totalGuests: todayStats[2],
                checkIns: todayStats[3],
                currentlyInOffice: todayStats[4],
                pendingOrders: todayStats[5],
                pendingGuestRequests: todayStats[6]
            },
            totals: {
                customers: totalStats[0],
                officeBoys: totalStats[1],
                totalUsers: totalStats[2]
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET /admin/dashboard/activity - Fetch DailyActivity with filters
export const getDashboardActivity = async (req: Request, res: Response) => {
    try {
        const {
            startDate,
            endDate,
            customerId,
            cabinNumber,
            page = 1,
            limit = 20
        } = req.query;

        const query: any = {};

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate as string);
            }
        }

        // Customer filter
        if (customerId) {
            query.customerId = customerId;
        }

        // Cabin number filter
        if (cabinNumber) {
            query.cabinNumber = cabinNumber;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [activities, total] = await Promise.all([
            History.find(query)
                .populate('customerId', 'name email cabinNumber')
                .sort({ date: -1 })
                .skip(skip)
                .limit(Number(limit)),
            History.countDocuments(query)
        ]);

        res.status(200).json({
            activities,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
