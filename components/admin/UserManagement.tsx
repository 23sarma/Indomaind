
import React from 'react';

const mockUsers = [
  { id: 1, email: 'user1@example.com', status: 'Active', joined: '2023-10-26' },
  { id: 2, email: 'testuser@example.com', status: 'Active', joined: '2023-10-25' },
  { id: 3, email: 'another.user@domain.com', status: 'Blocked', joined: '2023-10-24' },
  { id: 4, email: 'jane.doe@work.net', status: 'Active', joined: '2023-10-23' },
];

const UserManagement: React.FC = () => {
  return (
    <div className="p-6 bg-[#1a1a3a]/50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-3 text-sm font-semibold uppercase">Email</th>
              <th className="text-left p-3 text-sm font-semibold uppercase">Status</th>
              <th className="text-left p-3 text-sm font-semibold uppercase">Joined Date</th>
              <th className="text-left p-3 text-sm font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-white/5">
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-3">{user.joined}</td>
                <td className="p-3 space-x-2">
                  <button className="text-yellow-400 hover:text-yellow-300 text-sm">Block</button>
                  <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
