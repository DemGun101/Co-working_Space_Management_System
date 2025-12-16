import mongoose, { Schema } from "mongoose";

// Customer
export interface IUser {
  name: string;
  email: string;
  password: string; // Hardcoded
  role: 'customer' | 'office-boy';
  cabinNumber: string;
  todayChaiCoffeeUsed: number; // Max 1 per day
  isCheckedIn: boolean;
  lastCheckIn?: Date; // timestamp
  lastCheckOut?: Date; // timestamp
}

const UserSchema = new Schema<IUser>(
    {
        name:String,
        email:String,
        password:String,
        role:{
            type:String,enum:['customer','office-boy']
        },
        cabinNumber:String,
        todayChaiCoffeeUsed:Number,
        isCheckedIn:Boolean,
        lastCheckIn:{
            type:Date,required:false
        },
        lastCheckOut:{
            type:Date,required:false
        }

    }
)

export const User = mongoose.model<IUser>('User', UserSchema, 'user')
