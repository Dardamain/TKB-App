import { useState } from 'react';
import { Button } from './ui/button';
import { Check, Star, Zap, Crown, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  subscriptionPlan?: 'free' | 'plus' | 'premium';
}

interface SubscriptionsProps {
  user: User;
  demoMode?: boolean;
}

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  id: 'free' | 'plus' | 'premium';
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  features: PlanFeature[];
  popular?: boolean;
}

export function Subscriptions({ user, demoMode }: SubscriptionsProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(user.subscriptionPlan || 'free');
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started with travel savings',
      icon: Star,
      color: 'text-gray-400',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-600',
      features: [
        { text: 'Basic trip planning', included: true },
        { text: 'Up to 2 active trips', included: true },
        { text: 'Manual savings tracking', included: true },
        { text: 'Basic flight search', included: true },
        { text: '£2.50 fee for non-travel expenses', included: false, highlight: true },
        { text: 'Email support (48h response)', included: true },
        { text: 'Auto-deposit recommendations', included: false },
        { text: 'Premium flight deals', included: false },
        { text: 'Expense categorization', included: false },
        { text: 'Priority customer support', included: false }
      ]
    },
    {
      id: 'plus',
      name: 'Plus',
      price: 4.99,
      period: 'month',
      description: 'Enhanced features for serious travelers',
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500',
      popular: true,
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited active trips', included: true },
        { text: 'Auto-deposit calculations', included: true },
        { text: 'Advanced flight search & filters', included: true },
        { text: '£1.00 fee for non-travel expenses', included: false, highlight: true },
        { text: 'Priority email support (24h response)', included: true },
        { text: 'Expense categorization', included: true },
        { text: 'Trip sharing & collaboration', included: true },
        { text: 'Premium flight deals access', included: false },
        { text: '24/7 phone support', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      period: 'month',
      description: 'Complete travel savings solution with zero fees',
      icon: Crown,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500',
      features: [
        { text: 'Everything in Plus', included: true },
        { text: 'Zero fees for ANY expenses', included: true, highlight: true },
        { text: 'Premium flight deals & discounts', included: true },
        { text: 'Personal travel advisor', included: true },
        { text: '24/7 phone & chat support', included: true },
        { text: 'Advanced analytics & insights', included: true },
        { text: 'Custom savings strategies', included: true },
        { text: 'Travel insurance discounts', included: true },
        { text: 'Exclusive partner perks', included: true },
        { text: 'White-glove concierge service', included: true }
      ]
    }
  ];

  const handlePlanChange = async (planId: string) => {
    setIsChangingPlan(true);
    
    // Simulate API call
    setTimeout(() => {
      setSelectedPlan(planId);
      setIsChangingPlan(false);
      
      if (demoMode) {
        alert(`Demo: Successfully ${planId === user.subscriptionPlan ? 'confirmed' : 'upgraded to'} ${planId.toUpperCase()} plan!`);
      }
    }, 1500);
  };

  const getFeeInfo = (planId: string) => {
    switch (planId) {
      case 'free':
        return {
          amount: '£2.50',
          description: 'Fee charged when you use your TKB card for non-travel related purchases (restaurants, shopping, etc.)',
          color: 'text-red-400'
        };
      case 'plus':
        return {
          amount: '£1.00',
          description: 'Reduced fee for non-travel purchases. Perfect balance of savings and flexibility.',
          color: 'text-orange-400'
        };
      case 'premium':
        return {
          amount: '£0.00',
          description: 'Use your TKB card anywhere, anytime with zero fees. Complete freedom.',
          color: 'text-green-400'
        };
      default:
        return { amount: '', description: '', color: '' };
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-400">Unlock the full potential of your travel savings</p>
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            Current Plan: <span className="font-semibold">{user.subscriptionPlan?.toUpperCase() || 'FREE'}</span>
          </p>
        </div>
      </div>

      {/* Fee Comparison */}
      <div className="mb-8">
        <h3 className="text-white text-lg mb-4">Non-Travel Expense Fees</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const feeInfo = getFeeInfo(plan.id);
            return (
              <div key={plan.id} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <plan.icon className={`w-4 h-4 ${plan.color}`} />
                  <h4 className="text-white">{plan.name}</h4>
                </div>
                <div className={`text-2xl mb-2 ${feeInfo.color}`}>
                  {feeInfo.amount}
                </div>
                <p className="text-gray-400 text-sm">{feeInfo.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative ${plan.bgColor} border-2 ${
              selectedPlan === plan.id ? plan.borderColor : 'border-gray-600'
            } rounded-xl p-6 transition-all duration-300 hover:scale-105`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <plan.icon className={`w-8 h-8 ${plan.color} mx-auto mb-3`} />
              <h3 className="text-white text-xl mb-2">{plan.name}</h3>
              <div className="mb-3">
                <span className="text-3xl text-white">£{plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                      {feature.highlight ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-500"></div>
                      )}
                    </div>
                  )}
                  <span 
                    className={`text-sm ${
                      feature.included 
                        ? 'text-white' 
                        : feature.highlight 
                        ? 'text-red-300' 
                        : 'text-gray-500'
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => handlePlanChange(plan.id)}
              disabled={isChangingPlan}
              className={`w-full ${
                selectedPlan === plan.id
                  ? 'bg-green-600 hover:bg-green-700'
                  : plan.id === 'premium'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : plan.id === 'plus'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              {isChangingPlan ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : selectedPlan === plan.id ? (
                'Current Plan'
              ) : plan.price > (plans.find(p => p.id === selectedPlan)?.price || 0) ? (
                'Upgrade'
              ) : (
                'Select Plan'
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Usage Examples */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
        <h3 className="text-white text-lg mb-4">How Fees Work</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700 rounded">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                ✈️
              </div>
              <div>
                <p className="text-white text-sm">Flight booking: £1,200</p>
                <p className="text-gray-400 text-xs">Travel-related expense</p>
              </div>
            </div>
            <div className="text-green-400">£0.00 fee</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-700 rounded">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                🍔
              </div>
              <div>
                <p className="text-white text-sm">Restaurant meal: £45</p>
                <p className="text-gray-400 text-xs">Non-travel expense</p>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-red-400">Free: +£2.50</div>
              <div className="text-orange-400">Plus: +£1.00</div>
              <div className="text-green-400">Premium: £0.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}