
import React, { useState } from 'react';
import { User, Goal, Milestone, Shift, Attendance } from '../types';
import { RECOVERY_RESOURCES, QUOTES } from '../constants';

interface ResidentDashboardProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({ user, onUpdateUser }) => {
  const dailyQuote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];

  // Shift Management State
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [newShift, setNewShift] = useState<Omit<Shift, 'id'>>({
    day: 'Mon',
    startTime: '09:00',
    endTime: '17:00',
    employer: ''
  });

  // Attendance Management State
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState<Omit<Attendance, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'AA',
    location: '',
    time: '19:00'
  });

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = user.goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          milestones: g.milestones.map(m => 
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          )
        };
      }
      return g;
    });
    onUpdateUser({ ...user, goals: updatedGoals });
  };

  // --- Work Schedule Logic ---
  const handleSaveShift = () => {
    if (!newShift.employer) return;
    let updatedShifts: Shift[];
    if (editingShiftId) {
      updatedShifts = user.schedule.shifts.map(s => s.id === editingShiftId ? { ...newShift, id: editingShiftId } : s);
    } else {
      updatedShifts = [...user.schedule.shifts, { ...newShift, id: Date.now().toString() }];
    }
    onUpdateUser({ ...user, schedule: { shifts: updatedShifts } });
    setIsAddingShift(false);
    setEditingShiftId(null);
    setNewShift({ day: 'Mon', startTime: '09:00', endTime: '17:00', employer: '' });
  };

  const handleDeleteShift = (id: string) => {
    if (!confirm('Remove this shift?')) return;
    onUpdateUser({ ...user, schedule: { shifts: user.schedule.shifts.filter(s => s.id !== id) } });
  };

  // --- Meeting Attendance Logic ---
  const handleSaveMeeting = () => {
    if (!newMeeting.location) return;
    const attendance = user.attendance || [];
    let updatedAttendance: Attendance[];
    if (editingMeetingId) {
      updatedAttendance = attendance.map(a => a.id === editingMeetingId ? { ...newMeeting, id: editingMeetingId } : a);
    } else {
      updatedAttendance = [{ ...newMeeting, id: Date.now().toString() }, ...attendance];
    }
    onUpdateUser({ ...user, attendance: updatedAttendance });
    setIsAddingMeeting(false);
    setEditingMeetingId(null);
    setNewMeeting({ date: new Date().toISOString().split('T')[0], type: 'AA', location: '', time: '19:00' });
  };

  const handleDeleteMeeting = (id: string) => {
    if (!confirm('Delete this meeting record?')) return;
    onUpdateUser({ ...user, attendance: (user.attendance || []).filter(a => a.id !== id) });
  };

  const startEditMeeting = (m: Attendance) => {
    setEditingMeetingId(m.id);
    setNewMeeting({ date: m.date, type: m.type, location: m.location || '', time: m.time || '' });
    setIsAddingMeeting(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Financial Overview */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Hi, {user.name.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500 mb-6 font-medium">Safe Haven Recovery Portal</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-4 rounded-2xl text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Paid</p>
            <p className="text-xl font-black text-emerald-700">${user.totalPaid}</p>
          </div>
          <div className="bg-rose-50 p-4 rounded-2xl text-center">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Owed</p>
            <p className="text-xl font-black text-rose-700">${user.totalOwed}</p>
          </div>
        </div>
      </section>

      <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-100 italic font-medium leading-relaxed animate-in fade-in slide-in-from-top-4 duration-500">
        "{dailyQuote}"
      </div>

      {/* Meeting Attendance Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest text-xs">Meeting Attendance</h2>
          {!isAddingMeeting && (
            <button 
              onClick={() => setIsAddingMeeting(true)}
              className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest"
            >
              + Log Meeting
            </button>
          )}
        </div>

        {isAddingMeeting && (
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-50 shadow-md space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Meeting Name / Location</label>
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700" 
                  placeholder="e.g. Hope Group at Central" 
                  value={newMeeting.location} 
                  onChange={e => setNewMeeting({...newMeeting, location: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Type</label>
                <select 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 appearance-none"
                  value={newMeeting.type}
                  onChange={e => setNewMeeting({...newMeeting, type: e.target.value})}
                >
                  <option value="AA">AA</option>
                  <option value="NA">NA</option>
                  <option value="Celebrate Recovery">Celebrate Recovery</option>
                  <option value="SMART Recovery">SMART Recovery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Date</label>
                <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Time</label>
                <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveMeeting} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Save Entry</button>
              <button onClick={() => { setIsAddingMeeting(false); setEditingMeetingId(null); }} className="px-6 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {(!user.attendance || user.attendance.length === 0) ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 italic text-slate-400 text-sm">No meetings logged yet.</div>
          ) : (
            user.attendance.sort((a,b) => b.date.localeCompare(a.date)).map(m => (
              <div key={m.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full">{m.type}</span>
                    <span className="font-bold text-slate-800">{m.location}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{m.date} • {m.time}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEditMeeting(m)} className="p-3 text-slate-300 hover:text-emerald-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => handleDeleteMeeting(m.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Work Schedule Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest text-xs">Work Schedule</h2>
          {!isAddingShift && (
            <button onClick={() => setIsAddingShift(true)} className="bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
              + Add Shift
            </button>
          )}
        </div>

        {isAddingShift && (
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-md space-y-4 animate-in fade-in zoom-in duration-200">
            <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700" placeholder="Employer" value={newShift.employer} onChange={e => setNewShift({...newShift, employer: e.target.value})} />
            <div className="grid grid-cols-3 gap-2">
              <select className="p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 appearance-none" value={newShift.day} onChange={e => setNewShift({...newShift, day: e.target.value})}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="time" className="p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700" value={newShift.startTime} onChange={e => setNewShift({...newShift, startTime: e.target.value})} />
              <input type="time" className="p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700" value={newShift.endTime} onChange={e => setNewShift({...newShift, endTime: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveShift} className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Save Shift</button>
              <button onClick={() => setIsAddingShift(false)} className="px-6 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {user.schedule.shifts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 italic text-slate-400 text-sm">No work shifts scheduled.</div>
          ) : (
            user.schedule.shifts.map(shift => (
              <div key={shift.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">{shift.day}</span>
                    <span className="font-bold text-slate-800">{shift.employer}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{shift.startTime} - {shift.endTime}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleDeleteShift(shift.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Goals & Recovery Access */}
      <div className="grid grid-cols-1 gap-6">
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 px-2 uppercase tracking-widest text-xs">My Goals</h2>
          {user.goals.map(goal => (
            <div key={goal.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800">{goal.title}</h3>
              <div className="space-y-2">
                {goal.milestones.map(m => (
                  <button key={m.id} onClick={() => handleToggleMilestone(goal.id, m.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-left ${m.completed ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-blue-50 text-slate-700 shadow-sm'}`}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 ${m.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}>{m.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}</div>
                    <span className="text-sm font-bold">{m.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 px-2 uppercase tracking-widest text-xs">Recovery Access</h2>
          <div className="grid grid-cols-1 gap-2">
            {RECOVERY_RESOURCES.filter(r => r.type === 'meeting').map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noreferrer" className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm active:scale-[0.98] transition-all">
                <span className="font-bold text-slate-700 text-sm">{res.title}</span>
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
