export interface AdminStats {
  today: {
    totalChai: number;
    totalCoffee: number;
    totalGuests: number;
    checkIns: number;
    currentlyInOffice: number;
    pendingOrders: number;
    pendingGuestRequests: number;
  };
  totals: {
    customers: number;
    officeBoys: number;
    totalUsers: number;
  };
}

export interface ActivityUser {
  _id: string;
  name: string;
  email: string;
  cabinNumber: string;
}

export interface Activity {
  _id: string;
  customerId: ActivityUser;
  date: string;
  cabinNumber: string;
  attendance: {
    checkInTime: string | null;
    checkOutTime: string | null;
    totalHours: number;
    checkedInBy: 'customer' | 'office-boy' | null;
  };
  order: {
    type: 'chai' | 'coffee' | null;
    requestedAt: string | null;
    completedAt: string | null;
    status: 'pending' | 'completed' | null;
    orderedBy: 'customer' | 'office-boy' | null;
  };
  guests: Array<{
    guestName: string;
    expectedTime: string;
    status: 'pending' | 'completed';
    requestedAt: string;
    completedAt: string | null;
    registeredBy: 'customer' | 'office-boy';
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GetActivityParams {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  cabinNumber?: string;
  page?: number;
  limit?: number;
}

export interface GetActivityResponse {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'office-boy';
  cabinNumber: string;
  todayChaiCoffeeUsed: number;
  isCheckedIn: boolean;
}

export interface GetUsersParams {
  role?: 'customer' | 'office-boy';
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'office-boy';
  cabinNumber?: string;
  chaiCoffeeLimit?: number;
}

export interface CreateUserResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    cabinNumber: string;
  };
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: 'customer' | 'office-boy';
  cabinNumber?: string;
}

export interface UpdateUserResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    cabinNumber: string;
  };
}

export interface DeleteUserResponse {
  message: string;
}

export interface FilterCustomer {
  _id: string;
  name: string;
  cabinNumber: string;
}

export interface FilterOptionsResponse {
  cabins: string[];
  customers: FilterCustomer[];
}
