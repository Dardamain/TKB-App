import { useState } from 'react';
import { Plus, Minus, Plane, Calendar, MapPin, Star, Filter, TrendingUp, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Trip } from '../types';
import { formatDate, getDaysUntilTrip, sortTrips } from '../utils/tripUtils';

interface BudgetProps {
  trips: Trip[];
  activeTrips: Trip[];
  completedTrips: Trip[];
  onBackHome: () => void;
  onUpdateProgress?: (tripId: number, progress: number) => void;
  onUpdatePriority?: (tripId: number, priority: number, isStarred?: boolean) => void;
  onDeleteTrip?: (tripId: number) => void;
  onBookFlights?: (trip: Trip) => void;
}

export function Budget({ trips, activeTrips, completedTrips, onBackHome, onUpdateProgress, onUpdatePriority, onDeleteTrip, onBookFlights }: BudgetProps) {
  const [sortBy, setSortBy] = useState('priority');
  
  const sortedActiveTrips = sortTrips(activeTrips, sortBy);
  const currentTrip = sortedActiveTrips[0];

  const updateProgress = (tripId: number, delta: number) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !onUpdateProgress) return;
    
    const newProgress = Math.max(0, Math.min(100, trip.progress + delta));
    onUpdateProgress(tripId, newProgress);
  };

  const toggleStar = (tripId: number) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !onUpdatePriority) return;
    
    onUpdatePriority(tripId, trip.priority || 2, !trip.isStarred);
  };

  const updatePriority = (tripId: number, priority: number) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !onUpdatePriority) return;
    
    onUpdatePriority(tripId, priority, trip.isStarred);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-white">Budget Tracker</h2>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Plans</p>
          <p className="text-white text-xl">{trips.length}</p>
          <p className="text-gray-500 text-xs">{activeTrips.length} active • {completedTrips.length} completed</p>
        </div>
      </div>

      {/* Sort Controls */}
      {activeTrips.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                <SelectItem value="priority" className="text-white">Priority & Stars</SelectItem>
                <SelectItem value="date" className="text-white">Travel Date</SelectItem>
                <SelectItem value="progress" className="text-white">Progress</SelectItem>
                <SelectItem value="cost" className="text-white">Cost (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Completed Trips - Ready to Book */}
      {completedTrips.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Ready to Book ({completedTrips.length})</span>
            </h3>
          </div>
          <div className="space-y-3">
            {completedTrips.map((trip) => (
              <div key={trip.id} className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {trip.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      <h4 className="text-white">{trip.name}</h4>
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">GOAL REACHED</span>
                    </div>
                    <p className="text-gray-400 text-sm">{trip.from} → {trip.to}</p>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(trip.travelDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysUntilTrip(trip.travelDate)} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-green-400 text-sm">✓ Complete</p>
                      <p className="text-white">£{trip.estimatedCost?.toLocaleString() || 'N/A'}</p>
                    </div>
                    {onDeleteTrip && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Completed Trip</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to delete "{trip.name}"? This trip has reached its savings goal.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteTrip(trip.id)} className="bg-red-600 hover:bg-red-700 text-white">
                              Delete Trip
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                
                <div className="bg-green-500/20 rounded-lg p-2 mb-3">
                  <Progress value={100} className="h-2 bg-green-900/20" />
                  <div className="flex justify-between text-xs text-green-300 mt-1">
                    <span>£{trip.estimatedCost?.toLocaleString() || 'N/A'} saved</span>
                    <span>100% Complete!</span>
                  </div>
                </div>

                {onBookFlights && (
                  <Button 
                    onClick={() => onBookFlights(trip)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plane className="w-4 h-4 mr-2" />
                    Book Your Flight Now
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Primary Trip */}
      {currentTrip && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  {currentTrip.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  <h3 className="text-white text-lg">{currentTrip.name}</h3>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">PRIMARY</span>
                </div>
                <p className="text-white/80 text-sm">{currentTrip.starRating}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white/80 text-sm">Target</p>
                <p className="text-white text-xl">£{currentTrip.estimatedCost?.toLocaleString() || 'N/A'}</p>
              </div>
              {onDeleteTrip && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Primary Trip Plan</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Are you sure you want to delete "{currentTrip.name}"? This is your primary trip plan and deleting it cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteTrip(currentTrip.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        Delete Trip
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white text-sm">{currentTrip.from} → {currentTrip.to}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-white/80" />
              <span className="text-white text-sm">{getDaysUntilTrip(currentTrip.travelDate)} days left</span>
            </div>
          </div>

          {/* Auto-Deposit Info */}
          {currentTrip.dailyTarget && (
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-sm">Precise Auto-Deposit Targets</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-white text-sm">£{(currentTrip.dailyTarget || 0).toFixed(2)}</p>
                  <p className="text-white/60 text-xs">daily</p>
                </div>
                <div>
                  <p className="text-white text-sm">£{(currentTrip.weeklyTarget || 0).toFixed(2)}</p>
                  <p className="text-white/60 text-xs">weekly</p>
                </div>
                <div>
                  <p className="text-white text-sm">£{(currentTrip.monthlyTarget || 0).toFixed(2)}</p>
                  <p className="text-white/60 text-xs">monthly</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Savings Progress</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateProgress(currentTrip.id, -5)}
                  className="p-1 h-7 w-7 text-white/80 hover:text-white hover:bg-white/20"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-white min-w-[3rem] text-center">{currentTrip.progress.toFixed(1)}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateProgress(currentTrip.id, 5)}
                  className="p-1 h-7 w-7 text-white/80 hover:text-white hover:bg-white/20"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Progress value={currentTrip.progress} className="h-2 bg-white/20" />
            <div className="flex justify-between text-sm text-white/80">
              <span>£{(currentTrip.savedAmount || 0).toFixed(0)} saved</span>
              <span>£{((currentTrip.estimatedCost || 0) - (currentTrip.savedAmount || 0)).toFixed(0)} remaining</span>
            </div>
          </div>
        </div>
      )}

      {/* Other Active Trips */}
      {sortedActiveTrips.length > 1 && (
        <div className="mb-6">
          <h3 className="text-white text-lg mb-4">Other Active Plans</h3>
          <div className="space-y-3">
            {sortedActiveTrips.slice(1).map((trip) => (
              <div key={trip.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <button onClick={() => toggleStar(trip.id)} className={`${trip.isStarred ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}>
                        <Star className={`w-4 h-4 ${trip.isStarred ? 'fill-current' : ''}`} />
                      </button>
                      <h4 className="text-white">{trip.name}</h4>
                    </div>
                    <p className="text-gray-400 text-sm">{trip.from} → {trip.to}</p>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(trip.travelDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysUntilTrip(trip.travelDate)} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <Select value={trip.priority?.toString() || '2'} onValueChange={(value) => updatePriority(trip.id, parseInt(value))}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          <SelectItem value="1" className="text-white"><span className="text-red-400">High</span></SelectItem>
                          <SelectItem value="2" className="text-white"><span className="text-yellow-400">Medium</span></SelectItem>
                          <SelectItem value="3" className="text-white"><span className="text-green-400">Low</span></SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-white text-sm mt-1">£{trip.estimatedCost?.toLocaleString() || 'N/A'}</p>
                    </div>
                    {onDeleteTrip && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Trip Plan</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to delete "{trip.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteTrip(trip.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete Trip</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gray-400">{trip.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={trip.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>£{(trip.savedAmount || 0).toFixed(0)} saved</span>
                    <span>£{((trip.estimatedCost || 0) - (trip.savedAmount || 0)).toFixed(0)} remaining</span>
                  </div>
                </div>

                {trip.monthlyTarget && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Monthly target: £{trip.monthlyTarget.toFixed(2)}</span>
                      <span>Weekly: £{(trip.weeklyTarget || 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {trips.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white text-lg mb-2">No trips planned yet</h3>
            <p className="text-gray-400 text-sm mb-4">Start by booking a flight or planning a trip</p>
            <Button onClick={onBackHome} className="bg-blue-600 hover:bg-blue-700 text-white">
              Plan Your First Trip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}