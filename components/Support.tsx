import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Phone, Mail, MessageCircle, Clock, User, CheckCircle } from 'lucide-react';

export function Support() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [callRequested, setCallRequested] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    urgency: 'medium'
  });

  const supportOptions = [
    {
      id: 'call',
      title: 'Request a Call',
      description: 'Speak with our travel experts',
      icon: Phone,
      color: 'bg-green-600',
      available: 'Available 9 AM - 9 PM GMT'
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Get detailed help via email',
      icon: Mail,
      color: 'bg-blue-600',
      available: 'Response within 2-4 hours'
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Instant support chat',
      icon: MessageCircle,
      color: 'bg-purple-600',
      available: 'Available 24/7'
    }
  ];

  const handleCallRequest = () => {
    // Simulate call request
    setCallRequested(true);
    setTimeout(() => {
      setCallRequested(false);
      alert('Demo: A TKB travel expert will call you within 5 minutes!');
    }, 2000);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSubmitted(true);
    setTimeout(() => {
      setMessageSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        urgency: 'medium'
      });
      alert('Demo: Your message has been sent! We will respond within 2 hours.');
    }, 2000);
  };

  const handleLiveChat = () => {
    alert('Demo: Live chat would open here! This feature connects you instantly with our travel experts.');
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl text-white mb-2">Support Center</h2>
        <p className="text-gray-400">We're here to help you plan your perfect trip</p>
      </div>

      {/* Support Options */}
      {!selectedOption && (
        <div className="space-y-4 mb-8">
          {supportOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg mb-1">{option.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{option.description}</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500 text-xs">{option.available}</span>
                    </div>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Call Request Form */}
      {selectedOption === 'call' && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl">Request a Call Back</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedOption(null)}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Your Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter your phone number"
                type="tel"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Best Time to Call</label>
              <select 
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                defaultValue="anytime"
              >
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="evening">Evening (5 PM - 9 PM)</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            <Button 
              onClick={handleCallRequest}
              disabled={callRequested || !formData.name || !formData.phone}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              {callRequested ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling Call...
                </>
              ) : (
                'Request Call Back'
              )}
            </Button>

            <p className="text-gray-500 text-xs text-center">
              A TKB travel expert will call you within 5 minutes during business hours
            </p>
          </div>
        </div>
      )}

      {/* Email Support Form */}
      {selectedOption === 'email' && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl">Email Support</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedOption(null)}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </Button>
          </div>

          <form onSubmit={handleSubmitMessage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Your Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  type="email"
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Priority Level</label>
              <select 
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="low">Low - General inquiry</option>
                <option value="medium">Medium - Need help soon</option>
                <option value="high">High - Urgent assistance needed</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">How can we help you?</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Describe your question or issue in detail..."
                className="bg-gray-700 border-gray-600 text-white h-32"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={messageSubmitted}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {messageSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Message Sent!
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Live Chat */}
      {selectedOption === 'chat' && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl">Live Chat Support</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedOption(null)}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h4 className="text-white text-lg mb-2">Connect with a Travel Expert</h4>
              <p className="text-gray-400 mb-6">Get instant help with your travel planning and booking questions</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Sarah Johnson</p>
                  <p className="text-gray-400 text-xs">Senior Travel Advisor • Online</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                "Hi! I'm Sarah, and I'm here to help you plan your perfect trip. I can assist with bookings, destinations, budgeting, and more!"
              </p>
            </div>

            <Button 
              onClick={handleLiveChat}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              Start Live Chat
            </Button>

            <p className="text-gray-500 text-xs">
              Average response time: under 30 seconds
            </p>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {!selectedOption && (
        <div>
          <h3 className="text-white text-lg mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              {
                question: "How do I track my savings progress?",
                answer: "Use the Budget tab to monitor your trip savings and update your progress."
              },
              {
                question: "Can I modify my trip plans?",
                answer: "Yes! Go to your Budget tab and contact support to modify existing bookings."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, and bank transfers."
              },
              {
                question: "Is my financial data secure?",
                answer: "Yes, we use bank-level encryption to protect all your financial information."
              }
            ].map((faq, index) => (
              <details key={index} className="bg-gray-800 rounded-lg border border-gray-700">
                <summary className="p-4 text-white cursor-pointer hover:bg-gray-750">
                  {faq.question}
                </summary>
                <div className="px-4 pb-4 text-gray-400 text-sm">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}