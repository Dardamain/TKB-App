import { useState } from 'react';
import { Eye, EyeOff, CreditCard as CreditCardIcon } from 'lucide-react';
import { Button } from './ui/button';

interface CreditCardProps {
  className?: string;
}

export function CreditCard({ className = '' }: CreditCardProps) {
  const [showCVV, setShowCVV] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const cardNumber = '5876 1234 5678 9012';
  const expiryDate = '12/28';
  const cvv = '423';
  const cardholderName = 'DEMO USER';

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    setShowCVV(!showCVV);
  };

  return (
    <div className={`relative w-full max-w-sm mx-auto ${className}`}>
      <div 
        className={`relative w-full h-56 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleCardClick}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl p-6 shadow-2xl border border-gray-600">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-8 bg-yellow-400 rounded opacity-80"></div>
              <CreditCardIcon className="w-8 h-8 text-white opacity-80" />
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-white text-lg tracking-wider">
                  {cardNumber}
                </p>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/60 text-xs uppercase mb-1">Cardholder</p>
                  <p className="text-white text-sm">{cardholderName}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase mb-1">Expires</p>
                  <p className="text-white text-sm">{expiryDate}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              <p className="text-white/60 text-xs">Click to reveal CVV</p>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-blue-800 via-purple-600 to-blue-600 rounded-xl shadow-2xl border border-gray-600">
            <div className="w-full h-12 bg-black mt-6"></div>
            
            <div className="p-6 pt-8">
              <div className="bg-white h-8 rounded mb-4 flex items-center justify-end px-3">
                <div className="bg-gray-800 text-white px-2 py-1 rounded text-sm min-w-[3rem] text-center">
                  {showCVV ? cvv : '***'}
                </div>
              </div>
              
              <div className="text-white/80 text-xs mb-4">
                For your security, memorize your CVV and keep this card safe.
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-white/60 text-xs">
                  TKB BANK
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCVV(!showCVV);
                  }}
                  className="text-white/80 hover:text-white p-1"
                >
                  {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              <p className="text-white/60 text-xs">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-gray-400 text-sm">
          Click card to {isFlipped ? 'hide' : 'reveal'} CVV
        </p>
      </div>
    </div>
  );
}