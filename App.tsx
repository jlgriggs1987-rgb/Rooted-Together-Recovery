
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { INITIAL_USERS, OWNER_USER } from './constants';
import { Layout } from './components/Layout';
import { ResidentDashboard } from './components/ResidentDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [residents, setResidents] = useState<User[]>(INITIAL_USERS);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.RESIDENT);
  const [error, setError] = useState<string | null>(null);

  // Sync current user with resident list updates if the logged in user is a resident
  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.RESIDENT) {
      const updated = residents.find(r => r.id === currentUser.id);
      if (updated) {
        setCurrentUser(updated);
      }
    }
  }, [residents]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginRole === UserRole.OWNER) {
      if (loginEmail.toLowerCase() === OWNER_USER.email.toLowerCase() && loginPassword === OWNER_USER.password) {
        setCurrentUser(OWNER_USER);
      } else {
        setError('Invalid owner credentials.');
      }
    } else {
      const user = residents.find(
        u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
      );
      if (user) {
        setCurrentUser(user);
      } else {
        setError('Invalid resident email or password.');
      }
    }
  };

  const updateResident = (updatedUser: User) => {
    if (currentUser?.role !== UserRole.OWNER && currentUser?.id !== updatedUser.id) {
      console.warn("Unauthorized update attempt blocked");
      return;
    }
    setResidents(prev => prev.map(r => r.id === updatedUser.id ? updatedUser : r));
  };

  const addResident = (name: string, email: string) => {
    if (currentUser?.role !== UserRole.OWNER) return;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: 'newuser123',
      role: UserRole.RESIDENT,
      rentDueThisWeek: 150,
      totalPaid: 0,
      totalOwed: 0,
      schedule: { shifts: [] },
      goals: []
    };
    setResidents(prev => [...prev, newUser]);
  };

  const deleteResident = (id: string) => {
    if (currentUser?.role !== UserRole.OWNER) return;
    if (id === OWNER_USER.id) {
        alert("Cannot delete the house manager account.");
        return;
    }

    setResidents(prev => prev.filter(r => r.id !== id));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100">
              <span className="text-white text-3xl font-bold">RT</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Rooted Together</h1>
            <p className="text-slate-500 mt-2 font-medium">Recovery Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Access Level</label>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setLoginRole(UserRole.RESIDENT)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${loginRole === UserRole.RESIDENT ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Resident
                </button>
                <button 
                  type="button"
                  onClick={() => setLoginRole(UserRole.OWNER)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${loginRole === UserRole.OWNER ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Manager
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-4 rounded-2xl border-none bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 outline-none transition-all"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-4 rounded-2xl border-none bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 outline-none transition-all"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transform transition active:scale-[0.98] shadow-lg shadow-emerald-100 mt-2"
            >
              Enter Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
              Rooted Together Recovery Systems
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser} onLogout={() => {
      setCurrentUser(null);
      setLoginPassword('');
      setError(null);
    }}>
      {currentUser.role === UserRole.RESIDENT ? (
        <ResidentDashboard user={currentUser} onUpdateUser={updateResident} />
      ) : currentUser.role === UserRole.OWNER ? (
        <OwnerDashboard 
          residents={residents} 
          onAddResident={addResident}
          onDeleteResident={deleteResident}
          onUpdateResident={updateResident}
        />
      ) : (
        <div className="text-center py-20 text-slate-400 font-bold">
            Access denied. Please log in again.
        </div>
      )}
    </Layout>
  );
};

export default App;
