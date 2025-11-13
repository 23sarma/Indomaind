import React, { useState } from 'react';
import { User } from '@/types';
import Header from '@/components/dashboard/Header';

interface UserProfilePageProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onLogout, onBack }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const isGuest = user.email === 'guest@indomind.ai';

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 8) {
             setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
            return;
        }
        // Mock success
        console.log('Password change simulated for', user.email);
        setMessage({ type: 'success', text: 'Password changed successfully! (Simulated)' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] text-white">
      <Header user={user} onLogout={onLogout} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="bg-[#1a1a3a]/50 p-8 rounded-2xl border border-gray-800 shadow-xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">User Profile</h1>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 py-3">
                        <span className="text-gray-400">Email Address</span>
                        <span className="font-medium text-white">{user.email}</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-gray-700 py-3">
                        <span className="text-gray-400">Subscription Plan</span>
                        <span className="font-medium text-cyan-400">{isGuest ? 'Guest Access' : 'Indomind Pro (Mock)'}</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-gray-700 py-3">
                        <span className="text-gray-400">Member Since</span>
                        <span className="font-medium text-white">Today</span>
                    </div>
                </div>
            </div>

            {isGuest ? (
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Account Management</h2>
                    <div className="p-4 bg-cyan-900/30 border border-cyan-400/30 rounded-lg">
                      <p className="text-gray-300">You are currently using a guest account.</p>
                      <p className="text-gray-400 mt-2 text-sm">
                        To access features like password changes and persistent history, please{' '}
                        <button onClick={onLogout} className="font-semibold text-cyan-400 hover:underline">
                          register a free account
                        </button>.
                      </p>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div>
                            <label className="text-sm font-medium text-gray-300">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-300">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-2 bg-[#0a0a1a]/80 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                            />
                        </div>

                        {message && (
                            <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {message.text}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default UserProfilePage;