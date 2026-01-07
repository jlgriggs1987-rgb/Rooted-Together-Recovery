
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-black">RT</span>
            </div>
            <span className="font-bold text-slate-700 tracking-tight">Rooted Together</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
        {children}
      </main>
    </div>
  );
};
