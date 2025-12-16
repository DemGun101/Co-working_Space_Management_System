import mongoose, { Schema } from "mongoose";

// Order (Chai/Coffee)
export interface IOrder {
  customerId: mongoose.Types.ObjectId;
  cabinNumber: string;
  type: 'chai' | 'coffee';
  status: 'pending' | 'completed';
  requestedAt: Date; // timestamp
  completedAt?: Date; // timestamp
  addedBy: 'customer' | 'office-boy'; // who created it
}

export const OrderSchema = new Schema<IOrder>(
    {
        customerId:{
            type:Schema.Types.ObjectId,
            ref:'Customer'
        },
        
        cabinNumber:String,
        type:{
            type:String,
            enum:['chai','coffee']
        },
        status:{
            type:String,
            enum:['pending','completed']
        },
        requestedAt:Date,
        completedAt:{type:Date,required:false},
        addedBy:{
            type:String,
            enum:['customer','office-boy']
        }
    }
)

export const Order = mongoose.model<IOrder>('Order',OrderSchema)