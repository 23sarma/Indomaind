import React from 'react';
import { Tool, HistoryEntry, User } from '../../types';

interface ToolContainerProps {
  tool: Tool;
  onBack: () => void;
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  user: User;
}

const ToolContainer: React.FC<ToolContainerProps> = ({ tool, onBack, addToHistory, user }) => {
  const ToolComponent = tool.component;

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Tools
      </button>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">{tool.name}</h2>
        <p className="text-gray-400 mt-2">{tool.description}</p>
      </div>
      <div className="bg-[#1a1a3a]/50 p-6 rounded-2xl border border-gray-800 shadow-xl">
        {ToolComponent ? <ToolComponent addToHistory={addToHistory} user={user} /> : (
            <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">Under Development</h3>
                <p className="text-gray-300">The Indomind core AI is currently calibrating this tool. It will be fully operational shortly. Thank you for your patience.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ToolContainer;