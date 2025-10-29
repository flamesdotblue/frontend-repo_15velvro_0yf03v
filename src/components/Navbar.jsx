import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-indigo-600" />
          <h1 className="text-lg font-semibold">Face Role Auth</h1>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user.name}</span>
                <span className="mx-1">•</span>
                <span className="uppercase text-xs px-2 py-0.5 rounded bg-gray-100 border">{user.role}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-500">Please sign in</span>
          )}
        </div>
      </div>
    </header>
  );
}
