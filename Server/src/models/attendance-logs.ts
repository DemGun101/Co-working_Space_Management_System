import mongoose, { Document, Schema, Types } from "mongoose";

// Check-in/out Log
export interface IAttendanceLog extends Document {
  customerId: Types.ObjectId;
  cabinNumber: string;
  checkInTime: Date; // timestamp
  checkOutTime?: Date; // timestamp
  hoursSpent?: number; // calculated on checkout
  addedBy: 'customer' | 'office-boy';
}

export const AttendanceLogSchema = new Schema<IAttendanceLog>(
    {
        customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
},
        cabinNumber:String,
        checkInTime:Date,
        checkOutTime:{
            type:Date,required:false
        },
        hoursSpent:{
            type:Number,required:false
        },
        addedBy:{
            type:String,
            enum:['customer','office-boy']
        }
    }
)

export const AttendanceLog = mongoose.model<IAttendanceLog>("AttendanceLog",AttendanceLogSchema)
