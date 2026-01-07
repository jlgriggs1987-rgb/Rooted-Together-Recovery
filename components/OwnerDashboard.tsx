
import React, { useState, useMemo } from 'react';
import { User, Attendance } from '../types';

interface OwnerDashboardProps {
  residents: User[];
  onAddResident: (name: string, email: string) => void;
  onDeleteResident: (id: string) => void;
  onUpdateResident: (updatedUser: User) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ 
  residents, onAddResident, onDeleteResident, onUpdateResident 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [view, setView] = useState<'roster' | 'schedules'>('roster');
  
  const [filterName, setFilterName] = useState('');
  const [filterDay, setFilterDay] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newEmail) {
      onAddResident(newName, newEmail);
      setNewName('');
      setNewEmail('');
      setIsAdding(false);
    }
  };

  const handleNumericChange = (res: User, field: keyof User, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    onUpdateResident({ ...res, [field]: numValue });
  };

  const selectedResident = residents.find(r => r.id === selectedResidentId);

  const allShifts = useMemo(() => {
    const list: { residentName: string; day: string; start: string; end: string; employer: string }[] = [];
    residents.forEach(res => {
      res.schedule.shifts.forEach(shift => {
        list.push({
          residentName: res.name,
          day: shift.day,
          start: shift.startTime,
          end: shift.endTime,
          employer: shift.employer
        });
      });
    });

    return list.filter(s => {
      const matchName = s.residentName.toLowerCase().includes(filterName.toLowerCase());
      const matchDay = filterDay === '' || s.day === filterDay;
      return matchName && matchDay;
    });
  }, [residents, filterName, filterDay]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          onClick={() => setView('roster')}
          className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${view === 'roster' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Resident Roster
        </button>
        <button 
          onClick={() => setView('schedules')}
          className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${view === 'schedules' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Work Schedules
        </button>
      </div>

      {view === 'roster' ? (
        <>
          <div className="flex justify-between items-center px-2 pt-2">
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">House Management</h1>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest"
            >
              {isAdding ? 'Close' : '+ Add Resident'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border-2 border-emerald-50 space-y-4 animate-in fade-in zoom-in duration-200">
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700" placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} required />
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700" placeholder="Email Address" value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" required />
              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">Confirm Add</button>
            </form>
          )}

          <div className="space-y-3">
            {residents.map(res => (
              <div 
                key={res.id} 
                onClick={() => setSelectedResidentId(res.id)}
                className={`bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-all ${selectedResidentId === res.id ? 'ring-2 ring-emerald-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                    {res.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 leading-none mb-1">{res.name}</p>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Owed: ${res.totalOwed}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">Manage</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="px-2 pt-2"><h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Work Schedules</h1></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
            <input type="text" placeholder="Filter by name..." className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-bold outline-none" value={filterName} onChange={e => setFilterName(e.target.value)} />
            <select className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-bold appearance-none" value={filterDay} onChange={e => setFilterDay(e.target.value)}>
              <option value="">All Days</option>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            {allShifts.map((shift, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div><h4 className="font-black text-slate-800 text-lg">{shift.residentName}</h4><p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{shift.employer}</p></div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full"><span className="text-[10px] font-black text-slate-600 uppercase">{shift.day}</span></div>
                </div>
                <p className="text-slate-500 text-sm font-medium">{shift.start} - {shift.end}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedResident && view === 'roster' && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-4 overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
          <div className="max-w-xl mx-auto space-y-8 pt-8 pb-20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-100">{selectedResident.name.charAt(0)}</div>
                <div><h2 className="text-2xl font-black text-slate-800">{selectedResident.name}</h2><p className="text-sm text-slate-500 font-bold">{selectedResident.email}</p></div>
              </div>
              <button onClick={() => setSelectedResidentId(null)} className="p-4 text-slate-400 hover:text-slate-600"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <section className="bg-slate-50 p-6 rounded-3xl space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Financials</h3>
              <div className="grid grid-cols-1 gap-4">
                <div><label className="text-[10px] font-black text-slate-400 mb-1 block uppercase">Weekly Rent</label><input type="number" className="w-full p-4 bg-white rounded-2xl font-black text-xl text-slate-800 border-none outline-none" value={selectedResident.rentDueThisWeek} onChange={e => handleNumericChange(selectedResident, 'rentDueThisWeek', e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-black text-emerald-500 mb-1 block uppercase">Total Paid</label><input type="number" className="w-full p-4 bg-white rounded-2xl font-black text-lg text-emerald-700 border-none" value={selectedResident.totalPaid} onChange={e => handleNumericChange(selectedResident, 'totalPaid', e.target.value)} /></div>
                  <div><label className="text-[10px] font-black text-rose-500 mb-1 block uppercase">Total Owed</label><input type="number" className="w-full p-4 bg-white rounded-2xl font-black text-lg text-rose-700 border-none" value={selectedResident.totalOwed} onChange={e => handleNumericChange(selectedResident, 'totalOwed', e.target.value)} /></div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Recent Meeting Attendance</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(!selectedResident.attendance || selectedResident.attendance.length === 0) ? (
                  <p className="text-center py-4 text-xs text-slate-400 italic">No meetings logged by resident.</p>
                ) : (
                  selectedResident.attendance.sort((a,b) => b.date.localeCompare(a.date)).map(att => (
                    <div key={att.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-600 uppercase">{att.type}</span>
                          <p className="font-bold text-slate-700">{att.location || 'Logged Meeting'}</p>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">{att.date} • {att.time || 'N/A'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <button onClick={() => { if(confirm('Remove resident permanently?')) { onDeleteResident(selectedResident.id); setSelectedResidentId(null); } }} className="w-full py-4 text-rose-500 font-bold uppercase tracking-widest text-xs hover:bg-rose-50 rounded-2xl">Remove Resident Record</button>
          </div>
        </div>
      )}
    </div>
  );
};
