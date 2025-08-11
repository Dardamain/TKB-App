import { useState, useEffect, useRef } from 'react';
import { Auth } from './components/Auth';
import { Home } from './components/Home';
import { Trips } from './components/Trips';
import { Budget } from './components/Budget';
import { Plan } from './components/Plan';
import { Support } from './components/Support';
import { Subscriptions } from './components/Subscriptions';
import { supabase } from './utils/supabase/client';
import { User, Trip } from './types';
import { calculateSavingsTargets } from './utils/tripUtils';
import { apiRequest, handleApiError } from './utils/apiUtils';
import { NAVIGATION_TABS, SCROLL_THRESHOLD, DEFAULT_BALANCE } from './constants/navigation';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [userBalance, setUserBalance] = useState(DEFAULT_BALANCE);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [selectedCompletedTrip, setSelectedCompletedTrip] = useState<Trip | null>(null);
  
  const scrollPositionRef = useRef(0);

  // Calculate dynamic goal based on active trips (not completed ones)
  const activeTrips = savedTrips.filter(trip => trip.progress < 100);
  const completedTrips = savedTrips.filter(trip => trip.progress >= 100);
  const sortedActiveTrips = activeTrips.sort((a, b) => {
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return (a.priority || 3) - (b.priority || 3);
  });
  const primaryTrip = sortedActiveTrips[0];
  const goalAmount = primaryTrip?.estimatedCost || 5678.90;

  useEffect(() => {
    checkSession();
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // Update savings targets when trips change
    setSavedTrips(prev => prev.map(trip => {
      const targets = calculateSavingsTargets(trip);
      return {
        ...trip,
        dailyTarget: targets.dailyTarget,
        weeklyTarget: targets.weeklyTarget,
        monthlyTarget: targets.monthlyTarget
      };
    }));
  }, [savedTrips.length]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - scrollPositionRef.current);

      if (scrollDifference > SCROLL_THRESHOLD) {
        if (currentScrollY > scrollPositionRef.current && currentScrollY > 100) {
          setNavVisible(false);
        } else {
          setNavVisible(true);
        }
        scrollPositionRef.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  };

  const checkSession = async () => {
    try {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 5000)
      );
      
      const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
      const { data: { session }, error } = result;
      
      if (error) {
        handleApiError(error, 'Session check error');
      }
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
        try {
          await loadUserData(session.access_token);
        } catch (loadError) {
          handleApiError(loadError, 'Failed to load user data, continuing in demo mode');
          handleDemoMode();
        }
      }
    } catch (error) {
      handleApiError(error, 'Session check error, continuing without session');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (token: string) => {
    try {
      const response = await apiRequest('/profile', token);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserBalance(data.balance);
        setSavedTrips(data.trips || []);
        setDemoMode(false);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleAuthSuccess = async (token: string) => {
    setAccessToken(token);
    try {
      await loadUserData(token);
    } catch (error) {
      handleApiError(error, 'Failed to load user data after auth, falling back to demo mode');
      handleDemoMode();
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      handleApiError(error, 'Sign out error (continuing anyway)');
    }
    
    setUser(null);
    setAccessToken(null);
    setUserBalance(DEFAULT_BALANCE);
    setSavedTrips([]);
    setActiveTab('Home');
    setDemoMode(false);
  };

  const handleDemoMode = () => {
    setDemoMode(true);
    setUser({ 
      id: 'demo-user', 
      email: 'demo@example.com', 
      name: 'Demo User',
      subscriptionPlan: 'free'
    });
    setAccessToken('demo-token');
  };

  const updateBalance = (newBalance: number) => {
    const balanceDiff = newBalance - userBalance;
    setUserBalance(newBalance);
    
    if (primaryTrip && balanceDiff !== 0) {
      updateTripSavedAmount(primaryTrip.id, (primaryTrip.savedAmount || 0) + balanceDiff);
    }
  };

  const addSavings = (amount: number) => {
    setUserBalance(prev => prev + amount);
    
    if (primaryTrip) {
      updateTripSavedAmount(primaryTrip.id, (primaryTrip.savedAmount || 0) + amount);
    }
  };

  const updateTripSavedAmount = (tripId: number, savedAmount: number) => {
    setSavedTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        const newSavedAmount = Math.max(0, savedAmount);
        const progress = trip.estimatedCost ? Math.min(100, (newSavedAmount / trip.estimatedCost) * 100) : 0;
        const targets = calculateSavingsTargets({ ...trip, savedAmount: newSavedAmount });
        
        return {
          ...trip,
          savedAmount: newSavedAmount,
          progress,
          dailyTarget: targets.dailyTarget,
          weeklyTarget: targets.weeklyTarget,
          monthlyTarget: targets.monthlyTarget
        };
      }
      return trip;
    }));
  };

  const updateTripPriority = (tripId: number, priority: number, isStarred?: boolean) => {
    setSavedTrips(prev => 
      prev.map(trip => 
        trip.id === tripId 
          ? { ...trip, priority, isStarred: isStarred !== undefined ? isStarred : trip.isStarred }
          : trip
      )
    );
  };

  const deleteTrip = async (tripId: number) => {
    setSavedTrips(prev => prev.filter(trip => trip.id !== tripId));

    if (demoMode || !accessToken) return;

    try {
      const response = await apiRequest(`/trips/${tripId}`, accessToken, {
        method: 'DELETE'
      });

      if (!response.ok) {
        handleApiError(`HTTP ${response.status}`, 'Failed to delete trip from server (local deletion applied)');
      }
    } catch (error) {
      handleApiError(error, 'Error deleting trip from server (local deletion applied)');
    }
  };

  const handleBookFlights = (trip: Trip) => {
    setSelectedCompletedTrip(trip);
    setActiveTab('Book');
  };

  const createTrip = async (planData: any) => {
    const savedAmount = 0;
    const progress = 0;
    const targets = calculateSavingsTargets({
      ...planData,
      savedAmount,
      estimatedCost: planData.estimatedCost,
      returnDate: planData.returnDate
    } as Trip);

    const newTrip: Trip = {
      id: Date.now(),
      name: `${planData.starRating} Star Trip - ${planData.to.split(',')[0]}`,
      balance: userBalance,
      travelDate: planData.travelDate,
      returnDate: planData.returnDate,
      transport: planData.transport,
      from: planData.from,
      to: planData.to,
      starRating: planData.starRating,
      progress,
      estimatedCost: planData.estimatedCost || 3000,
      priority: 2,
      isStarred: false,
      savedAmount,
      dailyTarget: targets.dailyTarget,
      weeklyTarget: targets.weeklyTarget,
      monthlyTarget: targets.monthlyTarget
    };

    setSavedTrips(prev => [...prev, newTrip]);
    setActiveTab('Budget');

    if (demoMode || !accessToken) return;

    try {
      const response = await apiRequest('/trips', accessToken, {
        method: 'POST',
        body: JSON.stringify(newTrip)
      });

      if (!response.ok) {
        handleApiError(`HTTP ${response.status}`, 'Failed to save trip to server (local copy saved)');
      }
    } catch (error) {
      handleApiError(error, 'Error saving trip to server (local copy saved)');
    }
  };

  const updateTripProgress = async (tripId: number, progress: number) => {
    const trip = savedTrips.find(t => t.id === tripId);
    if (!trip) return;
    
    const newSavedAmount = trip.estimatedCost ? (progress / 100) * trip.estimatedCost : 0;
    updateTripSavedAmount(tripId, newSavedAmount);

    if (demoMode || !accessToken) return;

    try {
      const response = await apiRequest(`/trips/${tripId}`, accessToken, {
        method: 'PUT',
        body: JSON.stringify({ progress, savedAmount: newSavedAmount })
      });

      if (!response.ok) {
        handleApiError(`HTTP ${response.status}`, 'Failed to update trip progress on server (local update applied)');
      }
    } catch (error) {
      handleApiError(error, 'Error updating trip progress on server (local update applied)');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || !accessToken) {
    return <Auth onAuthSuccess={handleAuthSuccess} onDemoMode={handleDemoMode} />;
  }

  const renderActiveComponent = () => {
    const baseProps = {
      balance: userBalance,
      goalAmount,
      primaryTrip,
      user,
      trips: savedTrips,
      activeTrips,
      completedTrips,
      onPlanTrip: () => setActiveTab('Plan'),
      onSignOut: handleSignOut,
      onUpdateBalance: updateBalance,
      onAddSavings: addSavings,
      onUpdateTripPriority: updateTripPriority,
      onDeleteTrip: deleteTrip,
      onBookFlights: handleBookFlights,
      demoMode
    };

    switch (activeTab) {
      case 'Home':
        return <Home {...baseProps} />;
      case 'Book':
        return <Trips onBookTrip={createTrip} selectedTrip={selectedCompletedTrip} />;
      case 'Budget':
        return (
          <Budget 
            trips={savedTrips}
            activeTrips={activeTrips}
            completedTrips={completedTrips}
            onBackHome={() => setActiveTab('Home')}
            onUpdateProgress={updateTripProgress}
            onUpdatePriority={updateTripPriority}
            onDeleteTrip={deleteTrip}
            onBookFlights={handleBookFlights}
          />
        );
      case 'Plan':
        return <Plan onConfirmPlan={createTrip} onBack={() => setActiveTab('Home')} />;
      case 'Subscriptions':
        return <Subscriptions user={user} demoMode={demoMode} />;
      case 'Support':
        return <Support />;
      default:
        return <Home {...baseProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-center">
          <h1 className="text-2xl text-white">TKB</h1>
          <p className="text-blue-400 text-sm">Enabling Dreams</p>
          {demoMode && (
            <p className="text-purple-400 text-xs">Demo Mode • {user?.subscriptionPlan?.toUpperCase()} Plan</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveComponent()}
      </div>

      {/* Bottom Navigation with auto-hide */}
      <div 
        className={`fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 transition-transform duration-300 z-50 ${
          navVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-around py-3">
          {NAVIGATION_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== 'Book') {
                  setSelectedCompletedTrip(null);
                }
              }}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}