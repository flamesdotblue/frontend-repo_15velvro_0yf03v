import React, { useEffect, useState } from 'react';

export default function Dashboard({ token, baseUrl, user }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      if (user?.role !== 'admin') return;
      try {
        const res = await fetch(`${baseUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Failed to load users');
        setUsers(data);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchUsers();
  }, [token, baseUrl, user]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-white">
          <h3 className="font-semibold">Welcome</h3>
          <p className="text-sm text-gray-600">Signed in as {user.name}</p>
          <p className="text-xs mt-2 uppercase inline-block px-2 py-1 rounded bg-gray-100 border">{user.role}</p>
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <h3 className="font-semibold">Your Access</h3>
          <ul className="mt-2 text-sm text-gray-700 list-disc pl-4">
            {user.role === 'admin' && <li>Manage users</li>}
            {(user.role === 'admin' || user.role === 'manager') && <li>View analytics</li>}
            <li>Access secure content</li>
          </ul>
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <h3 className="font-semibold">Status</h3>
          <p className="text-sm text-gray-700">System operational.</p>
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Registered Users</h3>
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          <div className="overflow-hidden rounded-lg border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 border-b">Name</th>
                  <th className="text-left px-3 py-2 border-b">Email</th>
                  <th className="text-left px-3 py-2 border-b">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-3 py-2 border-b">{u.name}</td>
                    <td className="px-3 py-2 border-b">{u.email}</td>
                    <td className="px-3 py-2 border-b uppercase">{u.role}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-gray-500" colSpan={3}>
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
