import React, { useState } from 'react';
import { User, Tool, HistoryEntry } from '../../types';
import Header from '../dashboard/Header';
import UserManagement from './UserManagement';
import SelfControlSystem from './SelfControlSystem';
import ToolManagement from './ToolManagement';
import AdminCommandChat from './AdminCommandChat';
import AdminHistoryLog from './AdminHistoryLog';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
  tools: Tool[];
  onToolToggle: (toolId: string) => void;
  onToolAdd: (name: string, category: string) => void;
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
}

type AdminView = 'command' | 'self-control' | 'users' | 'tools' | 'history';

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout, tools, onToolToggle, onToolAdd, history, addToHistory }) => {
  const [view, setView] = useState<AdminView>('command');

  const renderView = () => {
    switch(view) {
      case 'command':
        return <AdminCommandChat onToolAdd={onToolAdd} addToHistory={addToHistory} />;
      case 'self-control':
        return <SelfControlSystem />;
      case 'users':
        return <UserManagement />;
      case 'tools':
        return <ToolManagement tools={tools} onToolToggle={onToolToggle} />;
      case 'history':
        return <AdminHistoryLog history={history} />;
      default:
        return <AdminCommandChat onToolAdd={onToolAdd} addToHistory={addToHistory} />;
    }
  };

  const NavLink: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${active ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-white/10'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a0a] to-[#3a1a1a] text-white">
      <Header user={user} onLogout={onLogout} isAdmin={true} />
      <div className="flex">
        <nav className="w-64 p-4 space-y-2 bg-[#1a1a3a]/30 h-screen sticky top-[73px]">
          <h2 className="text-xs uppercase text-gray-400 font-bold px-4">Admin Menu</h2>
          <NavLink active={view === 'command'} onClick={() => setView('command')}>Command Center</NavLink>
          <NavLink active={view === 'self-control'} onClick={() => setView('self-control')}>Self-Control System</NavLink>
          <NavLink active={view === 'users'} onClick={() => setView('users')}>User Management</NavLink>
          <NavLink active={view === 'tools'} onClick={() => setView('tools')}>Tool Management</NavLink>
          <NavLink active={view === 'history'} onClick={() => setView('history')}>History</NavLink>
        </nav>
        <main className="flex-grow p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
