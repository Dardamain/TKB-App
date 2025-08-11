import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Plus, Minus, Users, Baby, User } from 'lucide-react';
import { Passenger, FlightDetails } from '../types';

interface PassengerSelectorProps {
  flightDetails: FlightDetails;
  onUpdate: (details: FlightDetails) => void;
}

export function PassengerSelector({ flightDetails, onUpdate }: PassengerSelectorProps) {
  const [showDetailedForm, setShowDetailedForm] = useState(false);

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', change: number) => {
    const newDetails = { ...flightDetails };
    const newCount = Math.max(0, Math.min(20, newDetails[type] + change));
    
    // Ensure at least one adult
    if (type === 'adults' && newCount === 0 && (newDetails.children > 0 || newDetails.infants > 0)) {
      return;
    }
    
    newDetails[type] = newCount;
    
    // Update passengers array
    const updatedPassengers: Passenger[] = [];
    
    // Add adults
    for (let i = 0; i < newDetails.adults; i++) {
      const existingAdult = newDetails.passengers.find(p => p.type === 'adult' && p.id === `adult-${i}`);
      updatedPassengers.push(existingAdult || {
        id: `adult-${i}`,
        type: 'adult',
        age: 25,
        title: 'Mr',
        firstName: '',
        lastName: ''
      });
    }
    
    // Add children
    for (let i = 0; i < newDetails.children; i++) {
      const existingChild = newDetails.passengers.find(p => p.type === 'child' && p.id === `child-${i}`);
      updatedPassengers.push(existingChild || {
        id: `child-${i}`,
        type: 'child',
        age: 10,
        title: 'Mr',
        firstName: '',
        lastName: ''
      });
    }
    
    // Add infants
    for (let i = 0; i < newDetails.infants; i++) {
      const existingInfant = newDetails.passengers.find(p => p.type === 'infant' && p.id === `infant-${i}`);
      updatedPassengers.push(existingInfant || {
        id: `infant-${i}`,
        type: 'infant',
        age: 1,
        firstName: '',
        lastName: ''
      });
    }
    
    newDetails.passengers = updatedPassengers;
    onUpdate(newDetails);
  };

  const updatePassenger = (passengerId: string, field: keyof Passenger, value: string | number) => {
    const newDetails = { ...flightDetails };
    const passengerIndex = newDetails.passengers.findIndex(p => p.id === passengerId);
    
    if (passengerIndex !== -1) {
      newDetails.passengers[passengerIndex] = {
        ...newDetails.passengers[passengerIndex],
        [field]: value
      };
      onUpdate(newDetails);
    }
  };

  const getTotalPassengers = () => flightDetails.adults + flightDetails.children + flightDetails.infants;
  
  const getAgeLabel = (type: string) => {
    switch (type) {
      case 'adult': return '18+ years';
      case 'child': return '2-17 years';
      case 'infant': return '0-23 months';
      default: return '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'adult': return <User className="w-4 h-4" />;
      case 'child': return <Users className="w-4 h-4" />;
      case 'infant': return <Baby className="w-4 h-4" />;
      default: return null;
    }
  };

  // Prevent form submission when clicking passenger counter buttons
  const handleCounterClick = (e: React.MouseEvent, type: 'adults' | 'children' | 'infants', change: number) => {
    e.preventDefault();
    e.stopPropagation();
    updatePassengerCount(type, change);
  };

  return (
    <div className="space-y-6">
      {/* Passenger Counter */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Passengers ({getTotalPassengers()})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                {getIcon('adult')}
                <div>
                  <p className="text-white">Adults</p>
                  <p className="text-gray-400 text-sm">{getAgeLabel('adult')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => handleCounterClick(e, 'adults', -1)}
                disabled={flightDetails.adults <= 1}
                className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-white w-8 text-center">{flightDetails.adults}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => handleCounterClick(e, 'adults', 1)}
                disabled={flightDetails.adults >= 20}
                className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                {getIcon('child')}
                <div>
                  <p className="text-white">Children</p>
                  <p className="text-gray-400 text-sm">{getAgeLabel('child')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => handleCounterClick(e, 'children', -1)}
                disabled={flightDetails.children <= 0}
                className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-white w-8 text-center">{flightDetails.children}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => handleCounterClick(e, 'children', 1)}
                disabled={flightDetails.children >= 10}
                className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Infants */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                {getIcon('infant')}
                <div>
                  <p className="text-white">Infants</p>
                  <p className="text-gray-400 text-sm">{getAgeLabel('infant')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => handleCounterClick(e, 'infants', -1)}
                disabled={flightDetails.infants <= 0}
                className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-white w-8 text-center">{flightDetails.infants}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => handleCounterClick(e, 'infants', 1)}
                disabled={flightDetails.infants >= flightDetails.adults}
                className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {flightDetails.infants >= flightDetails.adults && flightDetails.infants > 0 && (
            <p className="text-yellow-400 text-xs">
              Number of infants cannot exceed number of adults
            </p>
          )}
        </CardContent>
      </Card>

      {/* Detailed Passenger Information */}
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            setShowDetailedForm(!showDetailedForm);
          }}
          className="mb-4 border-gray-600 text-gray-300 hover:text-white"
        >
          {showDetailedForm ? 'Hide' : 'Show'} Passenger Details
        </Button>

        {showDetailedForm && (
          <div className="space-y-4">
            {flightDetails.passengers.map((passenger, index) => (
              <Card key={passenger.id} className="bg-gray-800 border-gray-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center space-x-2">
                    {getIcon(passenger.type)}
                    <span>
                      {passenger.type.charAt(0).toUpperCase() + passenger.type.slice(1)} {index + 1}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {passenger.type !== 'infant' && (
                      <div>
                        <label className="text-gray-300 text-sm mb-2 block">Title</label>
                        <Select
                          value={passenger.title || 'Mr'}
                          onValueChange={(value) => updatePassenger(passenger.id, 'title', value)}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 text-white">
                            <SelectItem value="Mr" className="text-white">Mr</SelectItem>
                            <SelectItem value="Ms" className="text-white">Ms</SelectItem>
                            <SelectItem value="Mrs" className="text-white">Mrs</SelectItem>
                            <SelectItem value="Dr" className="text-white">Dr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">First Name</label>
                      <Input
                        value={passenger.firstName || ''}
                        onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Last Name</label>
                      <Input
                        value={passenger.lastName || ''}
                        onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Age</label>
                      <Input
                        type="number"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(passenger.id, 'age', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        min={passenger.type === 'infant' ? 0 : passenger.type === 'child' ? 2 : 18}
                        max={passenger.type === 'infant' ? 1 : passenger.type === 'child' ? 17 : 120}
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        Valid range: {getAgeLabel(passenger.type)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}