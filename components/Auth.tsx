import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthProps {
  onAuthSuccess: (accessToken: string) => void;
  onDemoMode: () => void;
}

export function Auth({ onAuthSuccess, onDemoMode }: AuthProps) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting authentication...', { isLogin, email });

      if (isLogin) {
        // Sign in
        console.log('Signing in with Supabase...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('Sign in response:', { data, error });

        if (error) {
          console.error('Sign in error:', error);
          setError(`Sign in failed: ${error.message}`);
          return;
        }

        if (data?.session?.access_token) {
          console.log('Sign in successful');
          onAuthSuccess(data.session.access_token);
        } else {
          setError('No access token received');
        }
      } else {
        // Sign up via server
        console.log('Signing up via server...');
        
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aff34bda/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ email, password, name }),
          });

          console.log('Signup response status:', response.status);
          const result = await response.json();
          console.log('Signup response:', result);

          if (!response.ok) {
            throw new Error(result.error || 'Failed to create account');
          }

          // After successful signup, sign in
          console.log('Signup successful, now signing in...');
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('Auto sign-in error after signup:', error);
            throw new Error(error.message);
          }

          if (data?.session?.access_token) {
            console.log('Auto sign-in successful');
            onAuthSuccess(data.session.access_token);
          } else {
            throw new Error('No access token received after signup');
          }
        } catch (fetchError) {
          console.error('Network error during signup:', fetchError);
          throw new Error('Network error - please check your connection or try demo mode');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(`${errorMessage}. Try demo mode to continue.`);
    } finally {
      setLoading(false);
    }
  };

  if (!showAuthForm) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg border border-blue-500 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">TKB</h1>
            <p className="text-blue-400">Enabling Dreams</p>
            <p className="text-gray-400 text-sm mt-4">Your Travel Budget & Planning Companion</p>
          </div>

          <div className="space-y-4">
            {/* Primary Demo Mode Button */}
            <Button
              onClick={onDemoMode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            >
              Start Planning Your Trip
            </Button>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Try all features instantly with demo mode
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <hr className="flex-1 border-gray-600" />
              <span className="px-3 text-gray-400 text-sm">or</span>
              <hr className="flex-1 border-gray-600" />
            </div>

            {/* Sign in option */}
            <Button
              onClick={() => setShowAuthForm(true)}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:text-white py-3"
            >
              Sign In for Persistent Data
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Demo mode: Full functionality, no account required<br/>
              Sign in: Save your data across sessions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg border border-blue-500 p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAuthForm(false)}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">TKB</h1>
            <p className="text-blue-400 text-sm">Enabling Dreams</p>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="flex rounded-lg bg-gray-700 p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm rounded ${
              isLogin ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm rounded ${
              !isLogin ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            onClick={onDemoMode}
            variant="ghost"
            className="text-gray-400 hover:text-white text-sm"
          >
            Having trouble? Try Demo Mode →
          </Button>
        </div>
      </div>
    </div>
  );
}