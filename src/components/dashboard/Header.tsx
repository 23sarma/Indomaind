import React, { useState } from 'react';
import { User } from '../../types';
import IndomindLogo from '../ui/IndomindLogo';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  isAdmin?: boolean;
  onShowHistory?: () => void;
  onShowProfile?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, isAdmin = false, onShowHistory, onShowProfile }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-[#0a0a1a]/60 backdrop-blur-lg p-4 flex justify-between items-center sticky top-0 z-50 border-b border-cyan-400/10">
      <div className="flex items-center gap-3">
        <IndomindLogo className="w-10 h-10" />
        <h1 className="text-xl font-bold text-white">
          Indomind {isAdmin && <span className="text-orange-400">(Admin)</span>}
        </h1>
      </div>
      <div className="relative">
        <button onBlur={() => setDropdownOpen(false)} onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
          <span className="text-white hidden sm:inline">{user.email}</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center font-bold">
            {user.email[0].toUpperCase()}
          </div>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1a1a3a] border border-gray-700 rounded-lg shadow-lg py-1 animate-fade-in-down">
            {onShowProfile && (
                <button onClick={() => { onShowProfile(); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">Profile</button>
            )}
            {onShowHistory && (
                 <button onClick={() => { onShowHistory(); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">History</button>
            )}
            <div className="border-t border-gray-700 my-1"></div>
            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
