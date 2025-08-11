import { useState } from 'react';
import { MapPin, Calendar, Star, Car, Calculator, Clock, Plane } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PassengerSelector } from './PassengerSelector';
import { PlanData, FlightDetails } from '../types';

interface PlanProps {
  onConfirmPlan: (planData: PlanData) => void;
  onBack: () => void;
}

interface Destination {
  country: string;
  city: string;
  code?: string;
  baseCost: number;
  continent: string;
  popular?: boolean;
}

interface Origin {
  country: string;
  city: string;
  code: string;
  continent: string;
}

export function Plan({ onConfirmPlan, onBack }: PlanProps) {
  const [formData, setFormData] = useState<PlanData>({
    travelDate: '',
    returnDate: '',
    from: '',
    to: '',
    starRating: '5-star',
    transport: 'Chauffeur',
    estimatedCost: 3000,
    flightDetails: {
      adults: 1,
      children: 0,
      infants: 0,
      passengers: [{
        id: 'adult-0',
        type: 'adult',
        age: 25,
        title: 'Mr',
        firstName: '',
        lastName: ''
      }],
      cabinClass: 'economy',
      directFlightsOnly: false,
      flexibleDates: false
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [originSearchTerm, setOriginSearchTerm] = useState('');
  const [selectedOriginContinent, setSelectedOriginContinent] = useState('all');

  // Comprehensive worldwide origins
  const origins: Origin[] = [
    // Europe
    { country: 'United Kingdom', city: 'London', code: 'LHR', continent: 'Europe' },
    { country: 'United Kingdom', city: 'Manchester', code: 'MAN', continent: 'Europe' },
    { country: 'United Kingdom', city: 'Birmingham', code: 'BHX', continent: 'Europe' },
    { country: 'United Kingdom', city: 'Glasgow', code: 'GLA', continent: 'Europe' },
    { country: 'United Kingdom', city: 'Edinburgh', code: 'EDI', continent: 'Europe' },
    { country: 'United Kingdom', city: 'Liverpool', code: 'LPL', continent: 'Europe' },
    { country: 'United Kingdom', city: 'Bristol', code: 'BRS', continent: 'Europe' },
    { country: 'United Kingdom', city: 'Leeds', code: 'LBA', continent: 'Europe' },
    { country: 'France', city: 'Paris', code: 'CDG', continent: 'Europe' },
    { country: 'France', city: 'Nice', code: 'NCE', continent: 'Europe' },
    { country: 'France', city: 'Lyon', code: 'LYS', continent: 'Europe' },
    { country: 'Germany', city: 'Berlin', code: 'BER', continent: 'Europe' },
    { country: 'Germany', city: 'Munich', code: 'MUC', continent: 'Europe' },
    { country: 'Germany', city: 'Frankfurt', code: 'FRA', continent: 'Europe' },
    { country: 'Spain', city: 'Madrid', code: 'MAD', continent: 'Europe' },
    { country: 'Spain', city: 'Barcelona', code: 'BCN', continent: 'Europe' },
    { country: 'Italy', city: 'Rome', code: 'FCO', continent: 'Europe' },
    { country: 'Italy', city: 'Milan', code: 'MXP', continent: 'Europe' },
    { country: 'Netherlands', city: 'Amsterdam', code: 'AMS', continent: 'Europe' },
    { country: 'Switzerland', city: 'Zurich', code: 'ZUR', continent: 'Europe' },
    { country: 'Austria', city: 'Vienna', code: 'VIE', continent: 'Europe' },
    { country: 'Belgium', city: 'Brussels', code: 'BRU', continent: 'Europe' },
    { country: 'Portugal', city: 'Lisbon', code: 'LIS', continent: 'Europe' },
    { country: 'Greece', city: 'Athens', code: 'ATH', continent: 'Europe' },
    { country: 'Turkey', city: 'Istanbul', code: 'IST', continent: 'Europe' },
    { country: 'Russia', city: 'Moscow', code: 'SVO', continent: 'Europe' },
    { country: 'Poland', city: 'Warsaw', code: 'WAW', continent: 'Europe' },
    { country: 'Czech Republic', city: 'Prague', code: 'PRG', continent: 'Europe' },
    { country: 'Hungary', city: 'Budapest', code: 'BUD', continent: 'Europe' },
    { country: 'Sweden', city: 'Stockholm', code: 'ARN', continent: 'Europe' },
    { country: 'Norway', city: 'Oslo', code: 'OSL', continent: 'Europe' },
    { country: 'Denmark', city: 'Copenhagen', code: 'CPH', continent: 'Europe' },
    { country: 'Finland', city: 'Helsinki', code: 'HEL', continent: 'Europe' },
    { country: 'Iceland', city: 'Reykjavik', code: 'KEF', continent: 'Europe' },
    
    // North America
    { country: 'United States', city: 'New York', code: 'JFK', continent: 'North America' },
    { country: 'United States', city: 'Los Angeles', code: 'LAX', continent: 'North America' },
    { country: 'United States', city: 'Chicago', code: 'ORD', continent: 'North America' },
    { country: 'United States', city: 'Miami', code: 'MIA', continent: 'North America' },
    { country: 'United States', city: 'San Francisco', code: 'SFO', continent: 'North America' },
    { country: 'United States', city: 'Las Vegas', code: 'LAS', continent: 'North America' },
    { country: 'United States', city: 'Seattle', code: 'SEA', continent: 'North America' },
    { country: 'United States', city: 'Boston', code: 'BOS', continent: 'North America' },
    { country: 'United States', city: 'Washington DC', code: 'DCA', continent: 'North America' },
    { country: 'United States', city: 'Atlanta', code: 'ATL', continent: 'North America' },
    { country: 'Canada', city: 'Toronto', code: 'YYZ', continent: 'North America' },
    { country: 'Canada', city: 'Vancouver', code: 'YVR', continent: 'North America' },
    { country: 'Canada', city: 'Montreal', code: 'YUL', continent: 'North America' },
    { country: 'Canada', city: 'Calgary', code: 'YYC', continent: 'North America' },
    { country: 'Mexico', city: 'Mexico City', code: 'MEX', continent: 'North America' },
    { country: 'Mexico', city: 'Cancun', code: 'CUN', continent: 'North America' },
    
    // Asia
    { country: 'Japan', city: 'Tokyo', code: 'NRT', continent: 'Asia' },
    { country: 'Japan', city: 'Osaka', code: 'KIX', continent: 'Asia' },
    { country: 'China', city: 'Beijing', code: 'PEK', continent: 'Asia' },
    { country: 'China', city: 'Shanghai', code: 'PVG', continent: 'Asia' },
    { country: 'China', city: 'Guangzhou', code: 'CAN', continent: 'Asia' },
    { country: 'South Korea', city: 'Seoul', code: 'ICN', continent: 'Asia' },
    { country: 'Thailand', city: 'Bangkok', code: 'BKK', continent: 'Asia' },
    { country: 'Singapore', city: 'Singapore', code: 'SIN', continent: 'Asia' },
    { country: 'Malaysia', city: 'Kuala Lumpur', code: 'KUL', continent: 'Asia' },
    { country: 'Indonesia', city: 'Jakarta', code: 'CGK', continent: 'Asia' },
    { country: 'Philippines', city: 'Manila', code: 'MNL', continent: 'Asia' },
    { country: 'Vietnam', city: 'Ho Chi Minh City', code: 'SGN', continent: 'Asia' },
    { country: 'India', city: 'Mumbai', code: 'BOM', continent: 'Asia' },
    { country: 'India', city: 'Delhi', code: 'DEL', continent: 'Asia' },
    { country: 'India', city: 'Bangalore', code: 'BLR', continent: 'Asia' },
    { country: 'UAE', city: 'Dubai', code: 'DXB', continent: 'Asia' },
    { country: 'UAE', city: 'Abu Dhabi', code: 'AUH', continent: 'Asia' },
    { country: 'Qatar', city: 'Doha', code: 'DOH', continent: 'Asia' },
    { country: 'Saudi Arabia', city: 'Riyadh', code: 'RUH', continent: 'Asia' },
    { country: 'Israel', city: 'Tel Aviv', code: 'TLV', continent: 'Asia' },
    { country: 'Iran', city: 'Tehran', code: 'IKA', continent: 'Asia' },
    
    // South America
    { country: 'Brazil', city: 'São Paulo', code: 'GRU', continent: 'South America' },
    { country: 'Brazil', city: 'Rio de Janeiro', code: 'GIG', continent: 'South America' },
    { country: 'Argentina', city: 'Buenos Aires', code: 'EZE', continent: 'South America' },
    { country: 'Chile', city: 'Santiago', code: 'SCL', continent: 'South America' },
    { country: 'Peru', city: 'Lima', code: 'LIM', continent: 'South America' },
    { country: 'Colombia', city: 'Bogotá', code: 'BOG', continent: 'South America' },
    
    // Africa
    { country: 'South Africa', city: 'Cape Town', code: 'CPT', continent: 'Africa' },
    { country: 'South Africa', city: 'Johannesburg', code: 'JNB', continent: 'Africa' },
    { country: 'Egypt', city: 'Cairo', code: 'CAI', continent: 'Africa' },
    { country: 'Morocco', city: 'Casablanca', code: 'CMN', continent: 'Africa' },
    { country: 'Kenya', city: 'Nairobi', code: 'NBO', continent: 'Africa' },
    { country: 'Nigeria', city: 'Lagos', code: 'LOS', continent: 'Africa' },
    
    // Oceania
    { country: 'Australia', city: 'Sydney', code: 'SYD', continent: 'Oceania' },
    { country: 'Australia', city: 'Melbourne', code: 'MEL', continent: 'Oceania' },
    { country: 'Australia', city: 'Brisbane', code: 'BNE', continent: 'Oceania' },
    { country: 'Australia', city: 'Perth', code: 'PER', continent: 'Oceania' },
    { country: 'New Zealand', city: 'Auckland', code: 'AKL', continent: 'Oceania' }
  ];

  // Comprehensive worldwide destinations
  const destinations: Destination[] = [
    // Europe
    { country: 'United Kingdom', city: 'London', code: 'LHR', baseCost: 1500, continent: 'Europe', popular: true },
    { country: 'France', city: 'Paris', code: 'CDG', baseCost: 2800, continent: 'Europe', popular: true },
    { country: 'Italy', city: 'Rome', code: 'FCO', baseCost: 2400, continent: 'Europe', popular: true },
    { country: 'Spain', city: 'Madrid', code: 'MAD', baseCost: 2200, continent: 'Europe' },
    { country: 'Spain', city: 'Barcelona', code: 'BCN', baseCost: 2300, continent: 'Europe' },
    { country: 'Germany', city: 'Berlin', code: 'BER', baseCost: 2100, continent: 'Europe' },
    { country: 'Netherlands', city: 'Amsterdam', code: 'AMS', baseCost: 1800, continent: 'Europe' },
    { country: 'Switzerland', city: 'Zurich', code: 'ZUR', baseCost: 3200, continent: 'Europe' },
    { country: 'Austria', city: 'Vienna', code: 'VIE', baseCost: 2600, continent: 'Europe' },
    { country: 'Greece', city: 'Athens', code: 'ATH', baseCost: 2200, continent: 'Europe', popular: true },
    { country: 'Portugal', city: 'Lisbon', code: 'LIS', baseCost: 2000, continent: 'Europe' },
    { country: 'Czech Republic', city: 'Prague', code: 'PRG', baseCost: 1900, continent: 'Europe' },
    { country: 'Poland', city: 'Warsaw', code: 'WAW', baseCost: 1700, continent: 'Europe' },
    { country: 'Sweden', city: 'Stockholm', code: 'ARN', baseCost: 2500, continent: 'Europe' },
    { country: 'Norway', city: 'Oslo', code: 'OSL', baseCost: 3000, continent: 'Europe' },
    { country: 'Denmark', city: 'Copenhagen', code: 'CPH', baseCost: 2700, continent: 'Europe' },
    { country: 'Iceland', city: 'Reykjavik', code: 'KEF', baseCost: 2800, continent: 'Europe' },
    
    // Asia
    { country: 'Japan', city: 'Tokyo', code: 'NRT', baseCost: 4200, continent: 'Asia', popular: true },
    { country: 'Japan', city: 'Osaka', code: 'KIX', baseCost: 4000, continent: 'Asia' },
    { country: 'China', city: 'Beijing', code: 'PEK', baseCost: 3500, continent: 'Asia' },
    { country: 'China', city: 'Shanghai', code: 'PVG', baseCost: 3600, continent: 'Asia' },
    { country: 'South Korea', city: 'Seoul', code: 'ICN', baseCost: 3800, continent: 'Asia' },
    { country: 'Thailand', city: 'Bangkok', code: 'BKK', baseCost: 2600, continent: 'Asia', popular: true },
    { country: 'Singapore', city: 'Singapore', code: 'SIN', baseCost: 3800, continent: 'Asia', popular: true },
    { country: 'Malaysia', city: 'Kuala Lumpur', code: 'KUL', baseCost: 2800, continent: 'Asia' },
    { country: 'Indonesia', city: 'Jakarta', code: 'CGK', baseCost: 2700, continent: 'Asia' },
    { country: 'Indonesia', city: 'Bali', code: 'DPS', baseCost: 2900, continent: 'Asia', popular: true },
    { country: 'Philippines', city: 'Manila', code: 'MNL', baseCost: 2800, continent: 'Asia' },
    { country: 'Vietnam', city: 'Ho Chi Minh City', code: 'SGN', baseCost: 2500, continent: 'Asia' },
    { country: 'India', city: 'Mumbai', code: 'BOM', baseCost: 2400, continent: 'Asia' },
    { country: 'India', city: 'Delhi', code: 'DEL', baseCost: 2300, continent: 'Asia' },
    { country: 'UAE', city: 'Dubai', code: 'DXB', baseCost: 4500, continent: 'Asia', popular: true },
    { country: 'UAE', city: 'Abu Dhabi', code: 'AUH', baseCost: 4200, continent: 'Asia' },
    { country: 'Qatar', city: 'Doha', code: 'DOH', baseCost: 4000, continent: 'Asia' },
    { country: 'Turkey', city: 'Istanbul', code: 'IST', baseCost: 2800, continent: 'Asia' },
    { country: 'Israel', city: 'Tel Aviv', code: 'TLV', baseCost: 3200, continent: 'Asia' },
    
    // North America
    { country: 'United States', city: 'New York', code: 'JFK', baseCost: 3200, continent: 'North America', popular: true },
    { country: 'United States', city: 'Los Angeles', code: 'LAX', baseCost: 3400, continent: 'North America', popular: true },
    { country: 'United States', city: 'Chicago', code: 'ORD', baseCost: 3100, continent: 'North America' },
    { country: 'United States', city: 'Miami', code: 'MIA', baseCost: 3300, continent: 'North America' },
    { country: 'United States', city: 'San Francisco', code: 'SFO', baseCost: 3500, continent: 'North America' },
    { country: 'United States', city: 'Las Vegas', code: 'LAS', baseCost: 3200, continent: 'North America' },
    { country: 'Canada', city: 'Toronto', code: 'YYZ', baseCost: 2800, continent: 'North America' },
    { country: 'Canada', city: 'Vancouver', code: 'YVR', baseCost: 3000, continent: 'North America' },
    { country: 'Mexico', city: 'Mexico City', code: 'MEX', baseCost: 2800, continent: 'North America' },
    { country: 'Mexico', city: 'Cancún', code: 'CUN', baseCost: 2900, continent: 'North America', popular: true },
    
    // South America
    { country: 'Brazil', city: 'São Paulo', code: 'GRU', baseCost: 3800, continent: 'South America' },
    { country: 'Brazil', city: 'Rio de Janeiro', code: 'GIG', baseCost: 3900, continent: 'South America', popular: true },
    { country: 'Argentina', city: 'Buenos Aires', code: 'EZE', baseCost: 3600, continent: 'South America' },
    { country: 'Chile', city: 'Santiago', code: 'SCL', baseCost: 3700, continent: 'South America' },
    { country: 'Peru', city: 'Lima', code: 'LIM', baseCost: 3400, continent: 'South America' },
    { country: 'Colombia', city: 'Bogotá', code: 'BOG', baseCost: 3200, continent: 'South America' },
    
    // Africa
    { country: 'South Africa', city: 'Cape Town', code: 'CPT', baseCost: 4200, continent: 'Africa', popular: true },
    { country: 'South Africa', city: 'Johannesburg', code: 'JNB', baseCost: 4000, continent: 'Africa' },
    { country: 'Egypt', city: 'Cairo', code: 'CAI', baseCost: 3200, continent: 'Africa' },
    { country: 'Morocco', city: 'Marrakech', code: 'RAK', baseCost: 2800, continent: 'Africa', popular: true },
    { country: 'Morocco', city: 'Casablanca', code: 'CMN', baseCost: 2700, continent: 'Africa' },
    { country: 'Kenya', city: 'Nairobi', code: 'NBO', baseCost: 3600, continent: 'Africa' },
    { country: 'Tanzania', city: 'Dar es Salaam', code: 'DAR', baseCost: 3700, continent: 'Africa' },
    
    // Oceania
    { country: 'Australia', city: 'Sydney', code: 'SYD', baseCost: 5200, continent: 'Oceania', popular: true },
    { country: 'Australia', city: 'Melbourne', code: 'MEL', baseCost: 5100, continent: 'Oceania' },
    { country: 'Australia', city: 'Brisbane', code: 'BNE', baseCost: 5000, continent: 'Oceania' },
    { country: 'New Zealand', city: 'Auckland', code: 'AKL', baseCost: 4800, continent: 'Oceania' },
    { country: 'Fiji', city: 'Nadi', code: 'NAN', baseCost: 4500, continent: 'Oceania' },
    
    // Island Destinations
    { country: 'Maldives', city: 'Malé', code: 'MLE', baseCost: 6000, continent: 'Asia', popular: true },
    { country: 'Seychelles', city: 'Victoria', code: 'SEZ', baseCost: 5500, continent: 'Africa' },
    { country: 'Mauritius', city: 'Port Louis', code: 'MRU', baseCost: 4800, continent: 'Africa' },
    { country: 'Bahamas', city: 'Nassau', code: 'NAS', baseCost: 3500, continent: 'North America' },
    { country: 'Barbados', city: 'Bridgetown', code: 'BGI', baseCost: 3600, continent: 'North America' }
  ];

  const continents = [
    { value: 'all', label: 'All Continents' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'North America', label: 'North America' },
    { value: 'South America', label: 'South America' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Oceania', label: 'Oceania' }
  ];

  const filteredOrigins = origins.filter(origin => {
    const matchesSearch = 
      origin.city.toLowerCase().includes(originSearchTerm.toLowerCase()) ||
      origin.country.toLowerCase().includes(originSearchTerm.toLowerCase()) ||
      origin.code.toLowerCase().includes(originSearchTerm.toLowerCase());
    
    const matchesContinent = selectedOriginContinent === 'all' || origin.continent === selectedOriginContinent;
    
    return matchesSearch && matchesContinent;
  });

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = 
      dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dest.code && dest.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesContinent = selectedContinent === 'all' || dest.continent === selectedContinent;
    
    return matchesSearch && matchesContinent;
  });

  const calculateEstimatedCost = (destination: string, starRating: string, transport: string, from: string, flightDetails: FlightDetails) => {
    const dest = destinations.find(d => `${d.city}, ${d.country}` === destination);
    if (!dest) return 3000;
    
    let flightCost = dest.baseCost;
    
    // Adjust for origin (London is base, others may be cheaper/more expensive)
    const origin = from.split(' (')[0];
    if (origin.includes('Manchester') || origin.includes('Birmingham')) flightCost *= 0.95;
    else if (origin.includes('Glasgow') || origin.includes('Edinburgh')) flightCost *= 0.9;
    else if (origin.includes('Liverpool') || origin.includes('Bristol')) flightCost *= 0.92;
    else if (!origin.includes('London')) flightCost *= 1.1; // International origins slightly more expensive
    
    // Calculate flight cost with cabin class multiplier
    let cabinMultiplier = 1;
    switch (flightDetails.cabinClass) {
      case 'premium-economy': cabinMultiplier = 1.5; break;
      case 'business': cabinMultiplier = 3.0; break;
      case 'first': cabinMultiplier = 5.0; break;
      default: cabinMultiplier = 1; // Economy is base
    }
    
    // Apply cabin class multiplier to base flight cost
    flightCost *= cabinMultiplier;
    
    // Calculate total flight cost for all passengers
    let totalFlightCost = flightCost * flightDetails.adults;
    totalFlightCost += flightCost * flightDetails.children * 0.75; // 25% discount for children
    totalFlightCost += flightCost * flightDetails.infants * 0.1; // 90% discount for infants
    
    // Add accommodation and other costs
    let accommodationCost = dest.baseCost * 0.4; // Base accommodation cost
    
    // Adjust accommodation for star rating
    if (starRating === '3-star') accommodationCost *= 0.6;
    else if (starRating === '4-star') accommodationCost *= 0.8;
    else if (starRating === '5-star') accommodationCost *= 1.2;
    
    // Multiply accommodation by number of rooms needed (assume 2 people per room)
    const totalPeople = flightDetails.adults + flightDetails.children;
    const roomsNeeded = Math.ceil(totalPeople / 2);
    accommodationCost *= roomsNeeded;
    
    // Add transport costs
    let transportCost = 500; // Base transport cost
    if (transport === 'Taxi') transportCost = 300;
    else if (transport === 'Public Transport') transportCost = 100;
    else if (transport === 'Rental Car') transportCost = 400;
    
    // Add food and miscellaneous (per person)
    const miscCost = 200 * (flightDetails.adults + flightDetails.children + flightDetails.infants * 0.5);
    
    const totalCost = totalFlightCost + accommodationCost + transportCost + miscCost;
    
    return Math.round(totalCost);
  };

  // PRECISE savings calculations from TODAY to RETURN DATE
  const calculateSavingsTarget = (cost: number, returnDate: string) => {
    if (!returnDate) return { monthly: 0, weekly: 0, daily: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const returnDateObj = new Date(returnDate);
    returnDateObj.setHours(23, 59, 59, 999); // End of return date
    
    const msUntilReturn = returnDateObj.getTime() - today.getTime();
    const daysUntilReturn = msUntilReturn / (1000 * 60 * 60 * 24);
    
    if (daysUntilReturn <= 0) return { monthly: 0, weekly: 0, daily: 0 };
    
    const daily = cost / daysUntilReturn;
    const weekly = daily * 7;
    const monthly = daily * 30.44; // Average days per month
    
    return {
      daily: Math.max(0, daily),
      weekly: Math.max(0, weekly),
      monthly: Math.max(0, monthly)
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.travelDate && formData.returnDate && formData.from && formData.to) {
      onConfirmPlan(formData);
    }
  };

  const handleInputChange = (field: keyof PlanData, value: string | FlightDetails) => {
    const updatedData = { ...formData, [field]: value };
    
    if (field === 'to' || field === 'starRating' || field === 'transport' || field === 'from' || field === 'flightDetails') {
      updatedData.estimatedCost = calculateEstimatedCost(
        field === 'to' ? value as string : updatedData.to,
        field === 'starRating' ? value as string : updatedData.starRating,
        field === 'transport' ? value as string : updatedData.transport,
        field === 'from' ? value as string : updatedData.from,
        field === 'flightDetails' ? value as FlightDetails : updatedData.flightDetails
      );
    }
    
    setFormData(updatedData);
  };

  const updateFlightDetails = (details: FlightDetails) => {
    handleInputChange('flightDetails', details);
  };

  const savingsTarget = calculateSavingsTarget(formData.estimatedCost, formData.returnDate);

  // Get cabin class display name
  const getCabinClassDisplay = (cabinClass: string) => {
    switch (cabinClass) {
      case 'premium-economy': return 'Premium Economy';
      case 'business': return 'Business Class';
      case 'first': return 'First Class';
      default: return 'Economy';
    }
  };

  // Calculate flight cost percentage
  const flightCostPercentage = 0.65; // Flights are typically 65% of total cost
  const accommodationPercentage = 0.2;
  const transportPercentage = 0.08;
  const miscPercentage = 0.07;

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-white">Plan Your Dream Trip</h2>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Estimated Cost</p>
          <p className="text-2xl text-white">£{formData.estimatedCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Auto-Deposit Calculator */}
      {formData.returnDate && formData.estimatedCost && (
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl mb-6 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="w-5 h-5 text-white" />
              <h3 className="text-white">Precise Auto-Deposit Targets</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-white text-lg">£{savingsTarget.daily.toFixed(2)}</p>
                <p className="text-white/80 text-xs">per day</p>
              </div>
              <div>
                <p className="text-white text-lg">£{savingsTarget.weekly.toFixed(2)}</p>
                <p className="text-white/80 text-xs">per week</p>
              </div>
              <div>
                <p className="text-white text-lg">£{savingsTarget.monthly.toFixed(2)}</p>
                <p className="text-white/80 text-xs">per month</p>
              </div>
            </div>
            <p className="text-white/70 text-xs mt-2 text-center">
              Save exactly these amounts from today until you return ({new Date(formData.returnDate).toLocaleDateString()})
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Departure Date</span>
            </label>
            <Input
              type="date"
              value={formData.travelDate}
              onChange={(e) => handleInputChange('travelDate', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Return Date</span>
            </label>
            <Input
              type="date"
              value={formData.returnDate}
              onChange={(e) => handleInputChange('returnDate', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              min={formData.travelDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>Flying From</span>
            </label>
            
            {/* Origin Filters */}
            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                placeholder="Search origins..."
                value={originSearchTerm}
                onChange={(e) => setOriginSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-sm"
              />
              <Select value={selectedOriginContinent} onValueChange={setSelectedOriginContinent}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  {continents.map((continent) => (
                    <SelectItem key={continent.value} value={continent.value} className="text-white">
                      {continent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Select onValueChange={(value) => handleInputChange('from', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select Origin" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60">
                {filteredOrigins.map((origin) => (
                  <SelectItem key={`${origin.city}-${origin.country}`} value={`${origin.city}, ${origin.country} (${origin.code})`} className="text-white">
                    {origin.city}, {origin.country} ({origin.code})
                  </SelectItem>
                ))}
                
                {filteredOrigins.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-400">No origins found</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>Flying To</span>
            </label>
            
            {/* Destination Filters */}
            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-sm"
              />
              <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  {continents.map((continent) => (
                    <SelectItem key={continent.value} value={continent.value} className="text-white">
                      {continent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Select onValueChange={(value) => handleInputChange('to', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select Destination" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60">
                {/* Popular Destinations First */}
                {filteredDestinations.filter(d => d.popular).length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs text-gray-400 bg-gray-700">Popular Destinations</div>
                    {filteredDestinations.filter(d => d.popular).map((dest) => (
                      <SelectItem key={`${dest.city}-${dest.country}`} value={`${dest.city}, ${dest.country}`} className="text-white">
                        <div className="flex justify-between items-center w-full">
                          <span>{dest.city}, {dest.country} {dest.code && `(${dest.code})`}</span>
                          <span className="text-gray-400 text-sm ml-4">from £{dest.baseCost}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                
                {/* All Other Destinations */}
                {filteredDestinations.filter(d => !d.popular).length > 0 && (
                  <>
                    {filteredDestinations.filter(d => d.popular).length > 0 && (
                      <div className="px-2 py-1 text-xs text-gray-400 bg-gray-700">All Destinations</div>
                    )}
                    {filteredDestinations.filter(d => !d.popular).map((dest) => (
                      <SelectItem key={`${dest.city}-${dest.country}`} value={`${dest.city}, ${dest.country}`} className="text-white">
                        <div className="flex justify-between items-center w-full">
                          <span>{dest.city}, {dest.country} {dest.code && `(${dest.code})`}</span>
                          <span className="text-gray-400 text-sm ml-4">from £{dest.baseCost}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                
                {filteredDestinations.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-400">No destinations found</div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Passenger Details */}
        <PassengerSelector 
          flightDetails={formData.flightDetails} 
          onUpdate={updateFlightDetails} 
        />

        {/* Flight Preferences */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Plane className="w-5 h-5" />
              <span>Flight Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Cabin Class</label>
              <Select 
                value={formData.flightDetails.cabinClass} 
                onValueChange={(value) => updateFlightDetails({
                  ...formData.flightDetails, 
                  cabinClass: value as 'economy' | 'premium-economy' | 'business' | 'first'
                })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="economy" className="text-white">Economy (Base Price)</SelectItem>
                  <SelectItem value="premium-economy" className="text-white">Premium Economy (+50%)</SelectItem>
                  <SelectItem value="business" className="text-white">Business Class (+200%)</SelectItem>
                  <SelectItem value="first" className="text-white">First Class (+400%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="direct-flights"
                  checked={formData.flightDetails.directFlightsOnly}
                  onCheckedChange={(checked) => updateFlightDetails({
                    ...formData.flightDetails, 
                    directFlightsOnly: checked as boolean
                  })}
                  className="border-gray-600 text-white"
                />
                <label htmlFor="direct-flights" className="text-gray-300 text-sm">
                  Direct flights only (may increase cost)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="flexible-dates"
                  checked={formData.flightDetails.flexibleDates}
                  onCheckedChange={(checked) => updateFlightDetails({
                    ...formData.flightDetails, 
                    flexibleDates: checked as boolean
                  })}
                  className="border-gray-600 text-white"
                />
                <label htmlFor="flexible-dates" className="text-gray-300 text-sm">
                  Flexible dates (±3 days for better prices)
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-300">
            <Star className="w-4 h-4" />
            <span>Experience Level</span>
          </label>
          <Select value={formData.starRating} onValueChange={(value) => handleInputChange('starRating', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="3-star" className="text-white">
                <div className="flex items-center space-x-2">
                  <span>3-Star</span>
                  <span className="text-gray-400 text-sm">(Budget-friendly • 40% off base price)</span>
                </div>
              </SelectItem>
              <SelectItem value="4-star" className="text-white">
                <div className="flex items-center space-x-2">
                  <span>4-Star</span>
                  <span className="text-gray-400 text-sm">(Comfortable • 20% off base price)</span>
                </div>
              </SelectItem>
              <SelectItem value="5-star" className="text-white">
                <div className="flex items-center space-x-2">
                  <span>5-Star</span>
                  <span className="text-gray-400 text-sm">(Luxury • 20% above base price)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transport */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-300">
            <Car className="w-4 h-4" />
            <span>Local Transport</span>
          </label>
          <Select value={formData.transport} onValueChange={(value) => handleInputChange('transport', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="Chauffeur" className="text-white">Private Chauffeur (Premium)</SelectItem>
              <SelectItem value="Taxi" className="text-white">Taxi Service</SelectItem>
              <SelectItem value="Rental Car" className="text-white">Rental Car</SelectItem>
              <SelectItem value="Public Transport" className="text-white">Public Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cost Breakdown */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Estimated Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Flights ({formData.flightDetails.adults + formData.flightDetails.children + formData.flightDetails.infants} passengers, {getCabinClassDisplay(formData.flightDetails.cabinClass)})
                </span>
                <span className="text-white">£{(formData.estimatedCost * flightCostPercentage).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Accommodation ({formData.starRating})</span>
                <span className="text-white">£{(formData.estimatedCost * accommodationPercentage).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transport ({formData.transport})</span>
                <span className="text-white">£{(formData.estimatedCost * transportPercentage).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Food & Miscellaneous</span>
                <span className="text-white">£{(formData.estimatedCost * miscPercentage).toFixed(0)}</span>
              </div>
              <hr className="border-gray-600" />
              <div className="flex justify-between">
                <span className="text-white">Total Estimated Cost</span>
                <span className="text-white text-lg">£{formData.estimatedCost.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                * Cabin class pricing: {getCabinClassDisplay(formData.flightDetails.cabinClass)}
                {formData.flightDetails.children > 0 && ' • Child discounts applied (25% off)'}
                {formData.flightDetails.infants > 0 && ' • Infant discounts applied (90% off)'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
          disabled={!formData.travelDate || !formData.returnDate || !formData.from || !formData.to}
        >
          Create My Savings Plan
        </Button>
      </form>
    </div>
  );
}