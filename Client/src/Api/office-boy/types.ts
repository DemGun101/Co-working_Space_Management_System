export interface Order {
  _id: string;
  customerId: string;
  cabinNumber: string;
  type: "chai" | "coffee";
  status: "pending" | "completed";
  requestedAt: string;
  completedAt?: string;
  addedBy: "customer" | "office-boy";
}

export type GetOrdersResponse = Order[];

export interface Guest {
  _id: string;
  customerId: string;
  cabinNumber: string;
  guestName: string;
  expectedTime: string;
  status: "pending" | "completed";
  requestedAt: string;
  completedAt?: string;
  addedBy: "customer" | "office-boy";
}

export type GetGuestsResponse = Guest[];

export interface GetStatsResponse {
  totalChai: number;
  totalCoffee: number;
  guests: number;
  checkIns: number;
  currentlyInOffice: number;
}

export interface CompleteOrderResponse {
  message: string;
  order: Order;
}

export interface CompleteGuestResponse {
  message: string;
  guestRequest: Guest;
}

export interface Customer {
  _id: string;
  name: string;
  cabinNumber: string;
  isCheckedIn: boolean;
  todayChaiCoffeeUsed: number;
}

export type GetCustomersResponse = Customer[];
