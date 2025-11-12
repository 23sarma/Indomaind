
import React, { useState } from 'react';
import { User, AuthView } from '../../types';
import IndomindLogo from '../ui/IndomindLogo';

interface LoginProps {
  onLogin: (user: User) => void;
  setView: (view: AuthView) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Mock login logic
      onLogin({ email });
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1a1a3a]/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-cyan-400/20">
      <div className="flex flex-col items-center mb-6">
        <IndomindLogo className="w-16 h-16" />
        <h1 className="text-3xl font-bold text-white mt-4">Welcome to Indomind</h1>
        <p className="text-gray-400">Sign in to access the future of AI</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <label className="text-sm font-medium text-gray-300">Email / Mobile Number</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-shadow"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-shadow"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/40"
        >
          Login
        </button>
        <div className="relative flex pt-2 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <button
            type="button"
            onClick={() => onLogin({ email: 'guest@indomind.ai' })}
            className="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300"
            aria-label="Continue as a guest user"
        >
            Continue as Guest
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => setView(AuthView.REGISTER)} className="font-semibold text-cyan-400 hover:underline">
            Register
          </button>
        </p>
        <p className="text-gray-400 mt-2">
          Are you an admin?{' '}
          <button onClick={() => setView(AuthView.ADMIN_LOGIN)} className="font-semibold text-orange-400 hover:underline">
            Admin Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
