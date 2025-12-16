import { User } from "../models"
import { Request, Response } from 'express';

export const loginUser = async (req: Request, res: Response) => {
    try {
        // Validate request body
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
const allUsers = await User.find({});
console.log('All users:', allUsers);
console.log('Looking for email:', req.body.email);


        const user = await User.findOne({ email: req.body.email });
       console.log('Found user:', user);
        console.log(req.body)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check password
        if (user.password !== req.body.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        // Success
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}