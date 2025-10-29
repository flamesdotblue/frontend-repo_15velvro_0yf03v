import React, { useState } from 'react';
import FaceCapture from './FaceCapture';

const roles = ['admin', 'manager', 'staff', 'user'];

export default function AuthPanel({ onAuthenticated, baseUrl }) {
  const [tab, setTab] = useState('login');
  const [embedding, setEmbedding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  const api = async (path, method = 'GET', body, authToken) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.detail || 'Request failed');
    return data;
  };

  const handleLogin = async () => {
    if (!embedding) return setMessage('Please capture your face first.');
    setLoading(true);
    setMessage('');
    try {
      const token = await api('/auth/login', 'POST', { embedding });
      localStorage.setItem('token', token.access_token);
      onAuthenticated(token.access_token);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email) return setMessage('Please fill name and email.');
    if (!embedding) return setMessage('Please capture your face first.');
    setLoading(true);
    setMessage('');
    try {
      await api('/auth/register', 'POST', { name, email, role, embedding });
      setMessage('Registration successful. You can now sign in.');
      setTab('login');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('login')}
          className={`px-4 py-2 rounded border ${tab === 'login' ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          Sign in
        </button>
        <button
          onClick={() => setTab('register')}
          className={`px-4 py-2 rounded border ${tab === 'register' ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          Register
        </button>
      </div>

      {tab === 'register' && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded border"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded border">
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Only admins can view the full user list.</p>
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Registering…' : 'Create account'}
            </button>
          </div>
          <div>
            <FaceCapture onCapture={setEmbedding} label="Capture Face for Registration" />
          </div>
        </div>
      )}

      {tab === 'login' && (
        <div className="space-y-4">
          <FaceCapture onCapture={setEmbedding} label="Capture Face to Sign In" />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in with Face'}
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-center text-gray-700">{message}</p>}
    </div>
  );
}
