import { Request, Response } from 'express';
import { User } from '../models';

// GET /admin/users - List all users with pagination
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const {
            role,
            search,
            page = 1,
            limit = 20
        } = req.query;

        const query: any = {};

        // Role filter
        if (role && (role === 'customer' || role === 'office-boy')) {
            query.role = role;
        }

        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { cabinNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            User.countDocuments(query)
        ]);

        res.status(200).json({
            users,
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

// GET /admin/users/:id - Get single user details
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// POST /admin/users - Create new customer/office-boy
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, cabinNumber, chaiCoffeeLimit } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Name, email, password, and role are required' });
        }

        if (role !== 'customer' && role !== 'office-boy') {
            return res.status(400).json({ message: 'Role must be customer or office-boy' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // Note: User model doesn't hash passwords currently
            role,
            cabinNumber: cabinNumber || '',
            todayChaiCoffeeUsed: 0,
            chaiCoffeeLimit: chaiCoffeeLimit || 1,
            isCheckedIn: false
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                cabinNumber: user.cabinNumber,
                chaiCoffeeLimit: user.chaiCoffeeLimit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// PATCH /admin/users/:id - Update user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, cabinNumber, chaiCoffeeLimit } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if new email already exists (if email is being changed)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (role && (role === 'customer' || role === 'office-boy')) user.role = role;
        if (cabinNumber !== undefined) user.cabinNumber = cabinNumber;
        if (chaiCoffeeLimit !== undefined) user.chaiCoffeeLimit = chaiCoffeeLimit;

        await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                cabinNumber: user.cabinNumber,
                chaiCoffeeLimit: user.chaiCoffeeLimit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// DELETE /admin/users/:id - Delete user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
