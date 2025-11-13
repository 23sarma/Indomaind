import React from 'react';
import { HistoryEntry } from '@/types';

interface AdminHistoryLogProps {
  history: HistoryEntry[];
}

const HistoryItem: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
  const roleStyles = {
    user: 'bg-cyan-800/30 border-cyan-600',
    model: 'bg-gray-700/30 border-gray-500',
    admin: 'bg-orange-800/30 border-orange-500',
    system: 'bg-yellow-800/30 border-yellow-500',
  };

  return (
    <div className={`p-3 rounded-md border-l-4 ${roleStyles[entry.role]}`}>
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="font-bold capitalize">{entry.role}</span>
        <span className="text-gray-400">{entry.timestamp.toLocaleString()}</span>
      </div>
      <p className="font-mono text-sm whitespace-pre-wrap text-gray-200">{entry.text}</p>
    </div>
  );
};

const AdminHistoryLog: React.FC<AdminHistoryLogProps> = ({ history }) => {
  return (
    <div className="p-6 bg-[#1a1a3a]/50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Full Interaction Log</h2>
      <div className="space-y-3 h-[70vh] overflow-y-auto pr-2">
        {history.length > 0 ? (
          [...history].reverse().map(entry => <HistoryItem key={entry.id} entry={entry} />)
        ) : (
          <p className="text-center text-gray-400 py-8">No history recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminHistoryLog;