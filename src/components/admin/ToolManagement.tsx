import React from 'react';
import { Tool } from '@/types';

interface ToolManagementProps {
  tools: Tool[];
  onToolToggle: (toolId: string) => void;
}

const ToolManagement: React.FC<ToolManagementProps> = ({ tools, onToolToggle }) => {
  return (
    <div className="p-6 bg-[#1a1a3a]/50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Tool Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-3 text-sm font-semibold uppercase">Tool Name</th>
              <th className="text-left p-3 text-sm font-semibold uppercase">Category</th>
              <th className="text-left p-3 text-sm font-semibold uppercase">Status</th>
              <th className="text-center p-3 text-sm font-semibold uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {tools.map(tool => (
              <tr key={tool.id} className="border-b border-gray-800 hover:bg-white/5">
                <td className="p-3 font-medium">{tool.name}</td>
                <td className="p-3 text-gray-400">{tool.category}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${tool.enabled ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {tool.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => onToolToggle(tool.id)}
                    className={`px-4 py-1 text-sm rounded-md font-semibold transition-colors ${tool.enabled ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {tool.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToolManagement;