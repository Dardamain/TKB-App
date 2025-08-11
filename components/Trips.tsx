import { useState, useEffect } from 'react';
import { Search, Filter, Plane, Calendar, Clock, MapPin, Star, TrendingUp, Users, Baby, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Plus, Minus } from 'lucide-react';
import { Trip } from '../types';

interface Flight {
  id: number;
  airline: string;
  logo: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  class: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  aircraft: string;
  stopDetails?: string;
  amenities: string[];
  discount?: number;
}

interface PassengerInfo {
  adults: number;
  children: number;
  infants: number;
}

interface TripsProps {
  onBookTrip: (tripData: any) => void;
  selectedTrip?: Trip | null;
}

export function Trips({ onBookTrip, selectedTrip }: TripsProps) {
  const [searchFrom, setSearchFrom] = useState('London (LHR)');
  const [searchTo, setSearchTo] = useState('Dubai (DXB)');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState<PassengerInfo>({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [classType, setClassType] = useState('Economy');
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);

  // Comprehensive flight database
  const flightDatabase: Flight[] = [
    // London to Dubai
    {
      id: 1,
      airline: 'Emirates',
      logo: '🇦🇪',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '08:30',
      arrivalTime: '18:45',
      duration: '7h 15m',
      stops: 0,
      price: 1249,
      class: 'Economy',
      aircraft: 'Boeing 777-300ER',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power'],
      discount: 15
    },
    {
      id: 2,
      airline: 'British Airways',
      logo: '🇬🇧',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '14:20',
      arrivalTime: '00:30+1',
      duration: '7h 10m',
      stops: 0,
      price: 1189,
      class: 'Economy',
      aircraft: 'Airbus A380',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power']
    },
    {
      id: 3,
      airline: 'Virgin Atlantic',
      logo: '🇬🇧',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '21:55',
      arrivalTime: '08:15+1',
      duration: '7h 20m',
      stops: 0,
      price: 1299,
      class: 'Economy',
      aircraft: 'Airbus A350-1000',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power', 'Premium Seats']
    },
    {
      id: 4,
      airline: 'Turkish Airlines',
      logo: '🇹🇷',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '10:15',
      arrivalTime: '20:45',
      duration: '8h 30m',
      stops: 1,
      price: 899,
      class: 'Economy',
      aircraft: 'Boeing 737-800',
      stopDetails: '2h layover in Istanbul (IST)',
      amenities: ['WiFi', 'Entertainment', 'Meals']
    },
    {
      id: 5,
      airline: 'Qatar Airways',
      logo: '🇶🇦',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '07:45',
      arrivalTime: '19:20',
      duration: '9h 35m',
      stops: 1,
      price: 1049,
      class: 'Economy',
      aircraft: 'Airbus A350-900',
      stopDetails: '1h 30m layover in Doha (DOH)',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power', 'Qsuite Access'],
      discount: 20
    },
    {
      id: 6,
      airline: 'Lufthansa',
      logo: '🇩🇪',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '13:40',
      arrivalTime: '02:15+1',
      duration: '10h 35m',
      stops: 1,
      price: 967,
      class: 'Economy',
      aircraft: 'Airbus A380',
      stopDetails: '2h 45m layover in Frankfurt (FRA)',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power']
    },
    {
      id: 7,
      airline: 'Emirates',
      logo: '🇦🇪',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '08:30',
      arrivalTime: '18:45',
      duration: '7h 15m',
      stops: 0,
      price: 3849,
      class: 'Business',
      aircraft: 'Boeing 777-300ER',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power', 'Flat Bed', 'Lounge Access', 'Priority Boarding']
    },
    {
      id: 8,
      airline: 'Etihad Airways',
      logo: '🇦🇪',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '12:00',
      arrivalTime: '22:30',
      duration: '7h 30m',
      stops: 0,
      price: 1359,
      class: 'Economy',
      aircraft: 'Boeing 787-9',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power']
    },
    {
      id: 9,
      airline: 'KLM',
      logo: '🇳🇱',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '09:25',
      arrivalTime: '23:45',
      duration: '12h 20m',
      stops: 1,
      price: 789,
      class: 'Economy',
      aircraft: 'Boeing 737-800',
      stopDetails: '4h layover in Amsterdam (AMS)',
      amenities: ['WiFi', 'Entertainment', 'Meals']
    },
    {
      id: 10,
      airline: 'Swiss International',
      logo: '🇨🇭',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '16:30',
      arrivalTime: '05:50+1',
      duration: '11h 20m',
      stops: 1,
      price: 1156,
      class: 'Economy',
      aircraft: 'Airbus A340-300',
      stopDetails: '2h 15m layover in Zurich (ZUR)',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power']
    },
    {
      id: 11,
      airline: 'Air France',
      logo: '🇫🇷',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '11:50',
      arrivalTime: '01:35+1',
      duration: '11h 45m',
      stops: 1,
      price: 1078,
      class: 'Economy',
      aircraft: 'Airbus A380',
      stopDetails: '3h layover in Paris (CDG)',
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power']
    },
    {
      id: 12,
      airline: 'Flydubai',
      logo: '🇦🇪',
      from: 'London (LHR)',
      to: 'Dubai (DXB)',
      departureTime: '23:45',
      arrivalTime: '10:15+1',
      duration: '7h 30m',
      stops: 0,
      price: 699,
      class: 'Economy',
      aircraft: 'Boeing 737 MAX 8',
      amenities: ['WiFi', 'Entertainment', 'Meals'],
      discount: 25
    }
  ];

  const updatePassengerCount = (type: keyof PassengerInfo, change: number) => {
    setPassengers(prev => {
      const newCount = Math.max(0, Math.min(50, prev[type] + change)); // Increased limit to 50
      
      // Ensure at least one adult
      if (type === 'adults' && newCount === 0 && (prev.children > 0 || prev.infants > 0)) {
        return prev;
      }
      
      // Infants cannot exceed adults
      if (type === 'infants' && newCount > prev.adults) {
        return prev;
      }
      
      if (type === 'adults' && newCount < prev.infants) {
        return { ...prev, [type]: newCount, infants: newCount };
      }
      
      return { ...prev, [type]: newCount };
    });
  };

  // Prevent form submission when clicking passenger counter buttons
  const handleCounterClick = (e: React.MouseEvent, type: keyof PassengerInfo, change: number) => {
    e.preventDefault();
    e.stopPropagation();
    updatePassengerCount(type, change);
  };

  const getTotalPassengers = () => passengers.adults + passengers.children + passengers.infants;

  const getIcon = (type: string) => {
    switch (type) {
      case 'adults': return <User className="w-4 h-4" />;
      case 'children': return <Users className="w-4 h-4" />;
      case 'infants': return <Baby className="w-4 h-4" />;
      default: return null;
    }
  };

  const getAgeLabel = (type: string) => {
    switch (type) {
      case 'adults': return '18+ years';
      case 'children': return '2-17 years';
      case 'infants': return '0-23 months';
      default: return '';
    }
  };

  // Generate realistic variations based on search
  const generateFlights = (from: string, to: string) => {
    // Base flights on the database, but modify for different routes
    const baseFlights = [...flightDatabase];
    
    // Modify prices and details based on route
    const routeMultiplier = getRouteMultiplier(from, to);
    
    return baseFlights.map(flight => ({
      ...flight,
      from,
      to,
      price: Math.round(flight.price * routeMultiplier),
      id: flight.id + Math.random() * 1000 // Ensure unique IDs
    })).slice(0, 15); // Show up to 15 flights
  };

  const getRouteMultiplier = (from: string, to: string) => {
    // Different price multipliers based on routes
    const fromCity = from.split(' ')[0].toLowerCase();
    const toCity = to.split(' ')[0].toLowerCase();
    
    // Short haul Europe
    if (['paris', 'amsterdam', 'berlin', 'madrid', 'rome'].includes(toCity)) {
      return 0.3;
    }
    
    // Long haul destinations
    if (['tokyo', 'sydney', 'los angeles', 'new york'].includes(toCity)) {
      return 1.8;
    }
    
    // Premium destinations
    if (['maldives', 'seychelles', 'bora bora'].includes(toCity)) {
      return 2.5;
    }
    
    return 1.0; // Default multiplier
  };

  const handleSearch = () => {
    if (!searchFrom || !searchTo || !departureDate) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newFlights = generateFlights(searchFrom, searchTo);
      setFlights(newFlights);
      setLoading(false);
    }, 1500);
  };

  const sortFlights = (flights: Flight[]) => {
    return [...flights].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].split('m')[0]);
          const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].split('m')[0]);
          return aDuration - bDuration;
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'stops':
          return a.stops - b.stops;
        default:
          return 0;
      }
    });
  };

  const calculateTotalPrice = (flight: Flight) => {
    const totalPassengers = getTotalPassengers();
    let totalPrice = flight.price * passengers.adults;
    
    // Child discount (typically 75% of adult fare)
    totalPrice += flight.price * passengers.children * 0.75;
    
    // Infant discount (typically 10% of adult fare)
    totalPrice += flight.price * passengers.infants * 0.1;
    
    return totalPrice;
  };

  const handleBookFlight = (flight: Flight) => {
    const totalFlightCost = calculateTotalPrice(flight);
    
    const tripData = {
      travelDate: departureDate,
      returnDate: returnDate,
      from: flight.from,
      to: flight.to,
      starRating: flight.class === 'First' ? '5-star' : flight.class === 'Business' ? '5-star' : '4-star',
      transport: 'Chauffeur',
      estimatedCost: Math.round(totalFlightCost + 1000), // Add accommodation estimate
      airline: flight.airline,
      flightPrice: totalFlightCost,
      flightDetails: {
        adults: passengers.adults,
        children: passengers.children,
        infants: passengers.infants,
        passengers: [], // Will be populated in the plan
        cabinClass: classType.toLowerCase().replace(' ', '-'),
        directFlightsOnly: flight.stops === 0,
        flexibleDates: false
      }
    };
    
    onBookTrip(tripData);
  };

  useEffect(() => {
    // Pre-fill with completed trip data if available
    if (selectedTrip) {
      setSearchFrom(selectedTrip.from || 'London (LHR)');
      setSearchTo(selectedTrip.to || 'Dubai (DXB)');
      setDepartureDate(selectedTrip.travelDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setReturnDate(selectedTrip.returnDate || new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      
      // Auto-search with pre-filled data
      setTimeout(() => {
        const flights = generateFlights(selectedTrip.from || 'London (LHR)', selectedTrip.to || 'Dubai (DXB)');
        setFlights(flights);
      }, 500);
    } else {
      // Load initial flights for popular route
      setSearchFrom('London (LHR)');
      setSearchTo('Dubai (DXB)');
      setDepartureDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setReturnDate(new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      
      setTimeout(() => {
        const initialFlights = generateFlights('London (LHR)', 'Dubai (DXB)');
        setFlights(initialFlights);
      }, 500);
    }
  }, [selectedTrip]);

  const sortedFlights = sortFlights(flights);

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl text-white mb-2">
          {selectedTrip ? `Book Your ${selectedTrip.name} Flight` : 'Book Your Flight'}
        </h2>
        <p className="text-gray-400">
          {selectedTrip 
            ? `Ready to book your completed savings goal of £${selectedTrip.estimatedCost?.toLocaleString()}` 
            : 'Search and compare live flight prices'
          }
        </p>
        {selectedTrip && (
          <div className="mt-2 p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">
                Congratulations! You've saved £{selectedTrip.estimatedCost?.toLocaleString()} for this trip. Time to book!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">From</label>
            <Input
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              placeholder="Origin city"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">To</label>
            <Input
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              placeholder="Destination city"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Departure</label>
            <Input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Return</label>
            <Input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={departureDate || new Date().toISOString().split('T')[0]}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Enhanced Passenger Selection */}
        <Card className="bg-gray-700 border-gray-600 mb-4">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Passengers ({getTotalPassengers()})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getIcon('adults')}
                <div>
                  <p className="text-white">Adults</p>
                  <p className="text-gray-400 text-sm">{getAgeLabel('adults')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCounterClick(e, 'adults', -1)}
                  disabled={passengers.adults <= 1}
                  className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-white w-8 text-center">{passengers.adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCounterClick(e, 'adults', 1)}
                  disabled={passengers.adults >= 50}
                  className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-600" />

            {/* Children */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getIcon('children')}
                <div>
                  <p className="text-white">Children</p>
                  <p className="text-gray-400 text-sm">{getAgeLabel('children')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCounterClick(e, 'children', -1)}
                  disabled={passengers.children <= 0}
                  className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-white w-8 text-center">{passengers.children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCounterClick(e, 'children', 1)}
                  disabled={passengers.children >= 30}
                  className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-600" />

            {/* Infants */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getIcon('infants')}
                <div>
                  <p className="text-white">Infants</p>
                  <p className="text-gray-400 text-sm">{getAgeLabel('infants')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCounterClick(e, 'infants', -1)}
                  disabled={passengers.infants <= 0}
                  className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-white w-8 text-center">{passengers.infants}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCounterClick(e, 'infants', 1)}
                  disabled={passengers.infants >= passengers.adults}
                  className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {passengers.infants >= passengers.adults && passengers.infants > 0 && (
              <p className="text-yellow-400 text-xs">
                Number of infants cannot exceed number of adults
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center space-x-4 mb-4">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Class</label>
            <Select value={classType} onValueChange={setClassType}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                <SelectItem value="Economy" className="text-white">Economy</SelectItem>
                <SelectItem value="Premium Economy" className="text-white">Premium Economy</SelectItem>
                <SelectItem value="Business" className="text-white">Business</SelectItem>
                <SelectItem value="First" className="text-white">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleSearch}
          disabled={loading || !searchFrom || !searchTo || !departureDate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              {selectedTrip ? 'Find Flights for Your Trip' : 'Search Flights'}
            </>
          )}
        </Button>
      </div>

      {/* Sort and Filter */}
      {flights.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                <SelectItem value="price" className="text-white">Price (Low to High)</SelectItem>
                <SelectItem value="duration" className="text-white">Duration (Shortest)</SelectItem>
                <SelectItem value="departure" className="text-white">Departure Time</SelectItem>
                <SelectItem value="stops" className="text-white">Fewest Stops</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-gray-400 text-sm">
            {flights.length} flights found
          </div>
        </div>
      )}

      {/* Flight Results */}
      <div className="space-y-4">
        {sortedFlights.map((flight) => {
          const totalPrice = calculateTotalPrice(flight);
          const isAffordable = selectedTrip && totalPrice <= (selectedTrip.estimatedCost || 0);
          
          return (
            <div key={flight.id} className={`bg-gray-800 rounded-lg p-6 border transition-colors ${
              selectedTrip && isAffordable 
                ? 'border-green-500 bg-gradient-to-r from-green-600/5 to-blue-600/5' 
                : 'border-gray-600 hover:border-blue-500'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{flight.logo}</div>
                  <div>
                    <h3 className="text-white text-lg">{flight.airline}</h3>
                    <p className="text-gray-400 text-sm">{flight.aircraft}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  {flight.discount && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="destructive" className="text-xs">
                        {flight.discount}% OFF
                      </Badge>
                      <span className="text-gray-400 line-through text-sm">
                        £{Math.round(totalPrice / (1 - flight.discount / 100))}
                      </span>
                    </div>
                  )}
                  <p className={`text-2xl ${isAffordable ? 'text-green-400' : 'text-white'}`}>
                    £{totalPrice.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm">total for {getTotalPassengers()} passenger{getTotalPassengers() !== 1 ? 's' : ''}</p>
                  {selectedTrip && isAffordable && (
                    <p className="text-green-400 text-xs">✓ Within your budget!</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">{flight.departureTime} - {flight.arrivalTime}</p>
                    <p className="text-gray-400 text-sm">{flight.duration}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
                    {flight.stopDetails && (
                      <p className="text-gray-400 text-sm">{flight.stopDetails}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white">{flight.class}</p>
                    <p className="text-gray-400 text-sm">{flight.amenities.length} amenities</p>
                  </div>
                </div>
              </div>

              {/* Passenger Breakdown */}
              {(passengers.children > 0 || passengers.infants > 0) && (
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                  <h4 className="text-white text-sm mb-2">Price Breakdown</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{passengers.adults} Adult{passengers.adults !== 1 ? 's' : ''}</span>
                      <span className="text-gray-300">£{(flight.price * passengers.adults).toLocaleString()}</span>
                    </div>
                    {passengers.children > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{passengers.children} Child{passengers.children !== 1 ? 'ren' : ''} (25% off)</span>
                        <span className="text-gray-300">£{(flight.price * passengers.children * 0.75).toLocaleString()}</span>
                      </div>
                    )}
                    {passengers.infants > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{passengers.infants} Infant{passengers.infants !== 1 ? 's' : ''} (90% off)</span>
                        <span className="text-gray-300">£{(flight.price * passengers.infants * 0.1).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {flight.amenities.slice(0, 4).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {flight.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{flight.amenities.length - 4} more
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-400 text-sm">
                  Per person from £{flight.price.toLocaleString()}
                  {selectedTrip && (
                    <span className="ml-2 text-blue-400">
                      • Saved budget: £{selectedTrip.estimatedCost?.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={() => handleBookFlight(flight)}
                  className={`${
                    selectedTrip && isAffordable 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {selectedTrip && isAffordable ? 'Book with Savings' : 'Book This Flight'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white">Searching for the best flights...</p>
            <p className="text-gray-400 text-sm">Comparing prices from 500+ airlines</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && flights.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg mb-2">Search for Flights</h3>
            <p className="text-gray-400 text-sm">Enter your travel details above to find the best flight deals</p>
          </div>
        </div>
      )}
    </div>
  );
}