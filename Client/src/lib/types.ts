// Customer
export interface Customer {
  id: string;
  name: string;
  email: string;
  password: string; // Hardcoded
  cabinNumber: string;
  todayChaiCoffeeUsed: number; // Max 1 per day
  isCheckedIn: boolean;
  lastCheckIn?: number; // timestamp
  lastCheckOut?: number; // timestamp
}

// Order (Chai/Coffee)
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  cabinNumber: string;
  type: 'chai' | 'coffee';
  status: 'pending' | 'completed';
  requestedAt: number; // timestamp
  completedAt?: number; // timestamp
  addedBy: 'customer' | 'office-boy'; // who created it
}

// Guest Request
export interface GuestRequest {
  id: string;
  customerId: string;
  customerName: string;
  cabinNumber: string;
  guestName: string;
  expectedTime: number; // timestamp
  status: 'pending' | 'completed';
  requestedAt: number;
  completedAt?: number;
  addedBy: 'customer' | 'office-boy';
}

// Check-in/out Log
export interface AttendanceLog {
  id: string;
  customerId: string;
  customerName: string;
  cabinNumber: string;
  checkInTime: number; // timestamp
  checkOutTime?: number; // timestamp
  hoursSpent?: number; // calculated on checkout
  addedBy: 'customer' | 'office-boy';
}
