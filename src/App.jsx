import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AuthPanel from './components/AuthPanel';
import Dashboard from './components/Dashboard';

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMe = async (tkn) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${baseUrl}/me`, {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Failed to load user');
      setUser(data);
    } catch (e) {
      setError(e.message);
      setUser(null);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!user ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Sign in with Face</h2>
              <p className="text-gray-600 mt-1">Role-based access control with privacy-friendly, passwordless login.</p>
            </div>
            <AuthPanel onAuthenticated={setToken} baseUrl={baseUrl} />
          </div>
        ) : (
          <Dashboard token={token} baseUrl={baseUrl} user={user} />
        )}

        {loading && <p className="mt-6 text-center text-sm text-gray-500">Loading…</p>}
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">
        Built with love. Demo-only face embedding for development purposes.
      </footer>
    </div>
  );
}

export default App;
