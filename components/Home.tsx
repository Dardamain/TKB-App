import { useState } from 'react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { CreditCard } from './CreditCard';
import { LogOut, User, Plane, Calendar, Edit3, Plus, PiggyBank, Star, Target, TrendingUp, Clock, Trash2, CheckCircle2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  subscriptionPlan?: 'free' | 'plus' | 'premium';
}

interface Trip {
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
}

interface HomeProps {
  balance: number;
  goalAmount: number;
  primaryTrip?: Trip;
  user: User;
  trips: Trip[];
  activeTrips: Trip[];
  completedTrips: Trip[];
  onPlanTrip: () => void;
  onSignOut: () => void;
  onUpdateBalance: (newBalance: number) => void;
  onAddSavings: (amount: number) => void;
  onUpdateTripPriority: (tripId: number, priority: number, isStarred?: boolean) => void;
  onDeleteTrip: (tripId: number) => void;
  onBookFlights: (trip: Trip) => void;
  demoMode?: boolean;
}

export function Home({ 
  balance, 
  goalAmount, 
  primaryTrip, 
  user, 
  trips, 
  activeTrips,
  completedTrips,
  onPlanTrip, 
  onSignOut, 
  onUpdateBalance, 
  onAddSavings,
  onUpdateTripPriority,
  onDeleteTrip,
  onBookFlights,
  demoMode 
}: HomeProps) {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [isAddingSavings, setIsAddingSavings] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [editBalance, setEditBalance] = useState(balance.toString());
  const [savingsAmount, setSavingsAmount] = useState('');
  
  const progressPercentage = Math.min((balance / goalAmount) * 100, 100);

  const handleUpdateBalance = () => {
    const newBalance = parseFloat(editBalance);
    if (!isNaN(newBalance) && newBalance >= 0) {
      onUpdateBalance(newBalance);
      setIsEditingBalance(false);
    }
  };

  const handleAddSavings = () => {
    const amount = parseFloat(savingsAmount);
    if (!isNaN(amount) && amount > 0) {
      onAddSavings(amount);
      setIsAddingSavings(false);
      setSavingsAmount('');
    }
  };

  const toggleTripStar = (tripId: number) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip && onUpdateTripPriority) {
      onUpdateTripPriority(tripId, trip.priority || 2, !trip.isStarred);
    }
  };

  const quickSavingsAmounts = [50, 100, 250, 500];

  const getDaysUntilTrip = (date: string) => {
    const today = new Date();
    const travelDate = new Date(date);
    const diffTime = travelDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-white">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <button 
              onClick={() => setShowCard(!showCard)}
              className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
            >
              •••• 5876 {showCard ? '(Hide Details)' : '(Show Card)'}
            </button>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSignOut}
          className="text-gray-400 hover:text-white p-2"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Interactive Credit Card */}
      {showCard && (
        <div className="mb-6">
          <CreditCard />
        </div>
      )}

      {/* Empty State for No Trips */}
      {trips.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl text-white mb-4">Ready for Your First Adventure?</h3>
            <p className="text-gray-400 mb-8">
              Create your first savings plan and start building towards your dream destination. 
              Every journey begins with a single step.
            </p>
            
            {/* Current Balance Display */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 mb-6 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white text-lg mb-1">Current Balance</h4>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl text-white">£{balance.toLocaleString()}</p>
                    {demoMode && (
                      <Dialog open={isEditingBalance} onOpenChange={setIsEditingBalance}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white/80 hover:text-white hover:bg-white/20 p-1"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle>Edit Balance (Demo Mode)</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">New Balance (£)</label>
                              <Input
                                type="number"
                                value={editBalance}
                                onChange={(e) => setEditBalance(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="Enter new balance"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={handleUpdateBalance}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                              >
                                Update Balance
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setIsEditingBalance(false)}
                                className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-blue-300 text-sm mt-2">Ready to be allocated to your dream trip</p>
            </div>

            <Button 
              onClick={onPlanTrip}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-xl mb-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              Plan Your First Trip
            </Button>
            
            <p className="text-gray-500 text-sm">
              Join thousands of travelers who've saved for their dream destinations
            </p>
          </div>
        </div>
      )}

      {/* Content when trips exist */}
      {trips.length > 0 && (
        <>
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white text-sm opacity-90 mb-1">Current Balance</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl text-white">£{balance.toLocaleString()}</p>
                  {demoMode && (
                    <Dialog open={isEditingBalance} onOpenChange={setIsEditingBalance}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white/80 hover:text-white hover:bg-white/20 p-1"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Edit Balance (Demo Mode)</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-300 text-sm mb-2">New Balance (£)</label>
                            <Input
                              type="number"
                              value={editBalance}
                              onChange={(e) => setEditBalance(e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="Enter new balance"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              onClick={handleUpdateBalance}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Update Balance
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditingBalance(false)}
                              className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Target className="w-3 h-3 text-white/80" />
                  <p className="text-white text-sm opacity-90">
                    {primaryTrip ? 'Primary Goal' : 'Goal'}
                  </p>
                </div>
                <p className="text-white text-lg">£{goalAmount.toLocaleString()}</p>
                {primaryTrip && (
                  <p className="text-white/70 text-xs mt-1">{primaryTrip.name}</p>
                )}
              </div>
            </div>
            
            {primaryTrip && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white opacity-90">
                  <span>Progress to Goal</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-white/20" />
                <div className="flex justify-between text-xs text-white/70">
                  <span>£{(goalAmount - balance).toFixed(0)} remaining</span>
                  <span>{getDaysUntilTrip(primaryTrip.travelDate)} days left</span>
                </div>
              </div>
            )}
          </div>

          {/* Auto-Deposit Recommendation */}
          {primaryTrip && primaryTrip.dailyTarget && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h3 className="text-green-300">Precise Auto-Deposit Targets</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mb-3">
                <div>
                  <p className="text-green-400 text-lg">£{(primaryTrip.dailyTarget || 0).toFixed(2)}</p>
                  <p className="text-green-300/80 text-xs">daily</p>
                </div>
                <div>
                  <p className="text-green-400 text-lg">£{(primaryTrip.weeklyTarget || 0).toFixed(2)}</p>
                  <p className="text-green-300/80 text-xs">weekly</p>
                </div>
                <div>
                  <p className="text-green-400 text-lg">£{(primaryTrip.monthlyTarget || 0).toFixed(2)}</p>
                  <p className="text-green-300/80 text-xs">monthly</p>
                </div>
              </div>
              <p className="text-green-300/70 text-xs text-center">
                Save these exact amounts to reach your {primaryTrip.name} goal by return date
              </p>
            </div>
          )}

          {/* Completed Trips - Ready to Book */}
          {completedTrips.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Ready to Book</span>
                </h3>
                <span className="text-green-400 text-sm">{completedTrips.length} completed</span>
              </div>
              <div className="space-y-3">
                {completedTrips.slice(0, 2).map((trip) => (
                  <div key={trip.id} className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <div>
                          <h4 className="text-white flex items-center space-x-2">
                            {trip.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                            <span>{trip.name}</span>
                          </h4>
                          <p className="text-gray-400 text-sm">{trip.from} → {trip.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <span className="text-green-400 text-sm">✓ Goal Reached!</span>
                          <p className="text-white">£{trip.estimatedCost?.toLocaleString() || 'N/A'}</p>
                        </div>
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
                              <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteTrip(trip.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete Trip
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(trip.travelDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysUntilTrip(trip.travelDate)} days</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-500/20 rounded-lg p-2 mb-3">
                      <Progress value={100} className="h-2 bg-green-900/20" />
                      <div className="flex justify-between text-xs text-green-300 mt-1">
                        <span>£{trip.estimatedCost?.toLocaleString() || 'N/A'} saved</span>
                        <span>100% Complete!</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => onBookFlights(trip)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plane className="w-4 h-4 mr-2" />
                      Book Your Flight Now
                    </Button>
                  </div>
                ))}
                
                {completedTrips.length > 2 && (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">+{completedTrips.length - 2} more completed trips</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Trips Preview */}
          {activeTrips.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg">Active Plans</h3>
                <span className="text-gray-400 text-sm">{activeTrips.length} active</span>
              </div>
              <div className="space-y-3">
                {activeTrips.slice(0, 2).map((trip, index) => (
                  <div key={trip.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleTripStar(trip.id)}
                          className={`${trip.isStarred ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                        >
                          <Star className={`w-4 h-4 ${trip.isStarred ? 'fill-current' : ''}`} />
                        </button>
                        <Plane className="w-4 h-4 text-blue-400" />
                        <h4 className="text-white">{trip.name}</h4>
                        {index === 0 && primaryTrip?.id === trip.id && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          {trip.progress.toFixed(1)}% saved
                        </span>
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
                              <AlertDialogTitle>Delete Trip Plan</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Are you sure you want to delete "{trip.name}"? This action cannot be undone and you'll lose all saved progress for this trip.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteTrip(trip.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete Trip
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(trip.travelDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysUntilTrip(trip.travelDate)} days</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>£{(trip.savedAmount || 0).toFixed(0)} of £{trip.estimatedCost?.toLocaleString() || 'N/A'}</span>
                      <span>£{((trip.estimatedCost || 0) - (trip.savedAmount || 0)).toFixed(0)} remaining</span>
                    </div>
                    
                    <Progress value={trip.progress} className="h-1" />
                  </div>
                ))}
                
                {activeTrips.length > 2 && (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">+{activeTrips.length - 2} more active plans</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3 mb-6">
            <Button 
              onClick={onPlanTrip}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Plan a New Trip
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Dialog open={isAddingSavings} onOpenChange={setIsAddingSavings}>
                <DialogTrigger asChild>
                  <Button 
                    className="py-3 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Add Savings
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Add Savings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Amount to Add (£)</label>
                      <Input
                        type="number"
                        value={savingsAmount}
                        onChange={(e) => setSavingsAmount(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter amount"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Quick amounts:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {quickSavingsAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setSavingsAmount(amount.toString())}
                            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            £{amount}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleAddSavings}
                        disabled={!savingsAmount || parseFloat(savingsAmount) <= 0}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Add £{savingsAmount || '0'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingSavings(false);
                          setSavingsAmount('');
                        }}
                        className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="py-3 bg-gray-800 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                View History
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl text-white">{trips.length}</p>
              <p className="text-gray-400 text-sm">Total Trips</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white">{activeTrips.length}</p>
              <p className="text-gray-400 text-sm">Active Plans</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white">{completedTrips.length}</p>
              <p className="text-gray-400 text-sm">Ready to Book</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}