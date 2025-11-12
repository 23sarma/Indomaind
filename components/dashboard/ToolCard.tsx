import React from 'react';
import { Tool } from '../../types';

interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const Icon = tool.icon;

  return (
    <div
      onClick={() => onSelect(tool)}
      className={`relative group bg-[#1a1a3a]/60 p-6 rounded-2xl border border-gray-800 hover:border-cyan-400/50 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-cyan-400/20 cursor-pointer`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-cyan-900/80 to-fuchsia-900/80 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/30">
          <Icon className="w-10 h-10 text-cyan-300" />
        </div>
        <h3 className="font-bold text-lg text-white mb-2">{tool.name}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{tool.description}</p>
      </div>
    </div>
  );
};

export default ToolCard;