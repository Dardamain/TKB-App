export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionPlan?: 'free' | 'plus' | 'premium';
}

export interface Passenger {
  id: string;
  type: 'adult' | 'child' | 'infant';
  age: number;
  title?: 'Mr' | 'Ms' | 'Mrs' | 'Dr';
  firstName?: string;
  lastName?: string;
}

export interface FlightDetails {
  adults: number;
  children: number;
  infants: number;
  passengers: Passenger[];
  cabinClass: 'economy' | 'premium-economy' | 'business' | 'first';
  directFlightsOnly: boolean;
  flexibleDates: boolean;
}

export interface Trip {
  id: number;
  name: string;
  balance: number;
  travelDate: string;
  returnDate: string;
  transport: string;
  progress: number;
  from?: string;
  to?: string;
  starRating?: string;
  estimatedCost?: number;
  priority?: number;
  isStarred?: boolean;
  savedAmount?: number;
  monthlyTarget?: number;
  weeklyTarget?: number;
  dailyTarget?: number;
  flightDetails?: FlightDetails;
}

export interface SavingsTargets {
  dailyTarget: number;
  weeklyTarget: number;
  monthlyTarget: number;
}

export interface PlanData {
  travelDate: string;
  returnDate: string;
  from: string;
  to: string;
  starRating: string;
  transport: string;
  estimatedCost: number;
  flightDetails: FlightDetails;
}