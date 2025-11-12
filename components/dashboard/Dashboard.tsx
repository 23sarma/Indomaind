import React, { useState } from 'react';
import { User, Tool, HistoryEntry } from '../../types';
import ToolCard from './ToolCard';
import ToolContainer from '../tools/ToolContainer';
import Header from './Header';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  tools: Tool[];
  onShowHistory: () => void;
  onShowProfile: () => void;
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, tools, onShowHistory, onShowProfile, addToHistory }) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const CATEGORIES = [...new Set(tools.map(tool => tool.category))];

  const filteredTools = tools.filter(tool => {
    const categoryMatch = filter === 'All' || tool.category === filter;
    const lowerCaseQuery = searchQuery.toLowerCase();
    const searchMatch = tool.name.toLowerCase().includes(lowerCaseQuery) || tool.description.toLowerCase().includes(lowerCaseQuery);
    return categoryMatch && searchMatch;
  });

  const handleToolSelect = (tool: Tool) => {
    if (tool.isImplemented) {
      setSelectedTool(tool);
    }
  };

  const handleBack = () => {
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] text-white">
      <Header user={user} onLogout={onLogout} onShowHistory={onShowHistory} onShowProfile={onShowProfile} />
      <main className="p-4 sm:p-6 lg:p-8">
        {selectedTool ? (
          <ToolContainer tool={selectedTool} onBack={handleBack} addToHistory={addToHistory} />
        ) : (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                Indomind AI Toolkit
              </h1>
              <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
                Explore our collection of 100+ advanced AI tools. Select a tool to begin.
              </p>
            </div>

            <div className="mb-8 px-4">
              <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for a tool by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-4 py-2 bg-[#1a1a3a]/70 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-[#1a1a3a]/70 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} onSelect={handleToolSelect} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;