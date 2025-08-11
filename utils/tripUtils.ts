import { Trip, SavingsTargets } from '../types';

export const calculateSavingsTargets = (trip: Trip): SavingsTargets => {
  if (!trip.estimatedCost || !trip.returnDate) {
    return { monthlyTarget: 0, weeklyTarget: 0, dailyTarget: 0 };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const returnDate = new Date(trip.returnDate);
  returnDate.setHours(23, 59, 59, 999);
  
  const msUntilReturn = returnDate.getTime() - today.getTime();
  const daysUntilReturn = msUntilReturn / (1000 * 60 * 60 * 24);
  
  if (daysUntilReturn <= 0) {
    return { monthlyTarget: 0, weeklyTarget: 0, dailyTarget: 0 };
  }
  
  const remainingAmount = trip.estimatedCost - (trip.savedAmount || 0);
  const dailyTarget = remainingAmount / daysUntilReturn;
  const weeklyTarget = dailyTarget * 7;
  const monthlyTarget = dailyTarget * 30.44;
  
  return {
    dailyTarget: Math.max(0, dailyTarget),
    weeklyTarget: Math.max(0, weeklyTarget),
    monthlyTarget: Math.max(0, monthlyTarget)
  };
};

export const getDaysUntilTrip = (date: string): number => {
  const today = new Date();
  const travelDate = new Date(date);
  const diffTime = travelDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const sortTrips = (trips: Trip[], sortBy: string): Trip[] => {
  return [...trips].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        return (a.priority || 3) - (b.priority || 3);
      case 'date':
        return new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'cost':
        return (b.estimatedCost || 0) - (a.estimatedCost || 0);
      default:
        return 0;
    }
  });
};

export const getPriorityColor = (priority: number): string => {
  switch (priority) {
    case 1: return 'text-red-400';
    case 2: return 'text-yellow-400';
    case 3: return 'text-green-400';
    default: return 'text-gray-400';
  }
};

export const getPriorityLabel = (priority: number): string => {
  switch (priority) {
    case 1: return 'High';
    case 2: return 'Medium';
    case 3: return 'Low';
    default: return 'Medium';
  }
};