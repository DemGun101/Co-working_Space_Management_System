import mongoose, { Schema } from "mongoose";

// Customer
export interface IUser {
  name: string;
  email: string;
  password: string; // Hardcoded
  role: 'customer' | 'office-boy' | 'admin';
  cabinNumber: string;
  todayChaiCoffeeUsed: number; // Current daily usage
  chaiCoffeeLimit: number; // Max per day (default 1)
  isCheckedIn: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        name:String,
        email:String,
        password:String,
        role:{
            type:String,enum:['customer','office-boy','admin']
        },
        cabinNumber:String,
        todayChaiCoffeeUsed: { type: Number, default: 0 },
        chaiCoffeeLimit: { type: Number, default: 1 },
        isCheckedIn: { type: Boolean, default: false }
    }
)

export const User = mongoose.model<IUser>('User', UserSchema, 'user')
