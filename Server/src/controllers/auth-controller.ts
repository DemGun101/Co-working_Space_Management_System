import { User } from "../models"
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const loginUser = async (req: Request, res: Response) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== req.body.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            {
                userId:user._id,
                email:user.email,
                role:user.role
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            {expiresIn:'24h'}
        )
        res.status(200).json({
            token,
            user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
            }
        });  
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}