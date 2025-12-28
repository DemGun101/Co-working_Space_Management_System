// models/daily-activity.ts
import mongoose, { Schema, Types, Document } from "mongoose";

export interface IHistory extends Document {
  customerId: Types.ObjectId;
  date: Date; // Just the date, no time (e.g., 2024-01-15T00:00:00)
  cabinNumber: string;
  
  // Attendance
  attendance: {
    checkInTime: Date | null;
    checkOutTime: Date | null;
    totalHours: number;
    checkedInBy: 'customer' | 'office-boy' | null;
  };
  
  // Order
  order: {
    type: 'chai' | 'coffee' | null;
    requestedAt: Date | null;
    completedAt: Date | null;
    status: 'pending' | 'completed' | null;
    orderedBy: 'customer' | 'office-boy' | null;
  };
  
  // Guests (array since multiple guests possible)
  guests: Array<{
    guestName: string;
    expectedTime: Date;
    status: 'pending' | 'completed';
    requestedAt: Date;
    completedAt: Date | null;
    registeredBy: 'customer' | 'office-boy';
  }>;
  
  // Quick stats
  summary: {
    totalGuests: number;
    hasOrdered: boolean;
    wasPresent: boolean;
  };
}

const HistorySchema = new Schema<IHistory>({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  cabinNumber: String,
  
  attendance: {
    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    totalHours: { type: Number, default: 0 },
    checkedInBy: { type: String, enum: ['customer', 'office-boy', null], default: null }
  },
  
  order: {
    type: { type: String, enum: ['chai', 'coffee', null], default: null },
    requestedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    status: { type: String, enum: ['pending', 'completed', null], default: null },
    orderedBy: { type: String, enum: ['customer', 'office-boy', null], default: null }
  },
  
  guests: [{
    guestName: String,
    expectedTime: Date,
    status: { type: String, enum: ['pending', 'completed'] },
    requestedAt: Date,
    completedAt: Date,
    registeredBy: { type: String, enum: ['customer', 'office-boy'] }
  }],
  
 
}, { timestamps: true });

HistorySchema.index({ customerId: 1, date: 1 }, { unique: true });

export const History = mongoose.model<IHistory>("History", HistorySchema);