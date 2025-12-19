// Order type (returned from GET /office-boy/orders)
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

// GET /office-boy/orders response
export type GetOrdersResponse = Order[];

// Guest type (returned from GET /office-boy/guests)
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

// GET /office-boy/guests response
export type GetGuestsResponse = Guest[];

// GET /office-boy/stats response
export interface GetStatsResponse {
  totalChai: number;
  totalCoffee: number;
  guests: number;
  checkIns: number;
  currentlyInOffice: number;
}

// PATCH /office-boy/orders/:id/complete response
export interface CompleteOrderResponse {
  message: string;
  order: Order;
}

// PATCH /office-boy/guests/:id/complete response
export interface CompleteGuestResponse {
  message: string;
  guestRequest: Guest;
}
