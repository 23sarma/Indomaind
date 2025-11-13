import React from 'react';
import { User, HistoryEntry } from '@/types';
import Header from '@/components/dashboard/Header';

interface UserHistoryPageProps {
  user: User;
  onLogout: () => void;
  history: HistoryEntry[];
  onBack: () => void;
}

const HistoryItem: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
  const roleStyles = {
    user: 'bg-cyan-600/20 border-l-4 border-cyan-500',
    model: 'bg-gray-700/20 border-l-4 border-gray-500',
    system: 'bg-yellow-600/20 border-l-4 border-yellow-500',
    admin: '',
  };

  return (
    <div className={`p-4 rounded-lg ${roleStyles[entry.role]}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold capitalize text-lg">{entry.role}</span>
        <span className="text-xs text-gray-400">{entry.timestamp.toLocaleString()}</span>
      </div>
      <p className="whitespace-pre-wrap text-gray-200">{entry.text}</p>
    </div>
  );
};

const UserHistoryPage: React.FC<UserHistoryPageProps> = ({ user, onLogout, history, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] text-white">
      <Header user={user} onLogout={onLogout} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-6">Interaction History</h1>
        <div className="space-y-4">
          {history.length > 0 ? (
             [...history].reverse().map(entry => <HistoryItem key={entry.id} entry={entry} />)
          ) : (
            <p className="text-center text-gray-400 py-8">No history recorded yet. Start a conversation with Indomind Chat!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserHistoryPage;