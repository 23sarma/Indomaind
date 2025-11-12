
import React, { useState } from 'react';
import { User, AuthView } from '../../types';
import IndomindLogo from '../ui/IndomindLogo';

interface AdminLoginProps {
  onLogin: (user: User, isAdmin: boolean) => void;
  setView: (view: AuthView) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminEmail = 'lobish12sarma@gmail.com';
  const adminPassword = 'Lobish2000';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === adminEmail && password === adminPassword) {
      onLogin({ email }, true);
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1a1a3a]/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-orange-400/20">
      <div className="flex flex-col items-center mb-6">
        <IndomindLogo className="w-16 h-16" />
        <h1 className="text-3xl font-bold text-orange-400 mt-4">Admin Control Panel</h1>
        <p className="text-gray-400">Restricted Access</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <label className="text-sm font-medium text-gray-300">Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300">Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
        >
          Authenticate
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <button onClick={() => setView(AuthView.LOGIN)} className="font-semibold text-cyan-400 hover:underline">
          Return to User Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
