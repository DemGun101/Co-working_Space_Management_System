import mongoose, { Document, Schema, Types } from "mongoose";


// Guest Request
export interface IGuestRequest extends Document{
  customerId: Types.ObjectId;
  cabinNumber: string;
  guestName: string;
  expectedTime: Date; // timestamp
  status: 'pending' | 'completed';
  requestedAt: Date;
  completedAt?: Date;
  addedBy: 'customer' | 'office-boy';
}

export const GuestRequestSchema = new Schema<IGuestRequest>(
    {
        customerId:{
            type:Schema.Types.ObjectId
        },
        cabinNumber:String,
        guestName:String,
        expectedTime: Date, // timestamp
  status: {type:String,enum:['pending' , 'completed']},
  requestedAt: Date,
  completedAt: {type:Date,required:false},
  addedBy: {type:String,enum:['customer' , 'office-boy']} 

    }
)

export const GuestRequest = mongoose.model<IGuestRequest>("GuestRequest",GuestRequestSchema)

