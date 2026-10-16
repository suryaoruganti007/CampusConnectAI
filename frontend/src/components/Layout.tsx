import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, Bot, GraduationCap, LayoutDashboard, LogOut, ClipboardCheck, FileText, CalendarCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function signOut() { logout(); navigate('/login'); }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><GraduationCap size={22} /></div><div><strong>CampusConnect</strong><span>AI CAMPUS PLATFORM</span></div></div>
        <nav>
          <NavLink to="/" end><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/courses"><BookOpen size={18} /> Courses</NavLink>
          <NavLink to="/assistant"><Bot size={18} /> AI Assistant</NavLink>
          <NavLink to="/assignments"><ClipboardCheck size={18} /> Assignments</NavLink>
          <NavLink to="/attendance"><CalendarCheck size={18} /> Attendance</NavLink>
          <NavLink to="/documents"><FileText size={18} /> Campus Documents</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</div>
          <div className="user-meta"><strong>{user?.name}</strong><span>{user?.role}</span></div>
          <button className="icon-button" onClick={signOut} title="Sign out" aria-label="Sign out"><LogOut size={18} /></button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><span className="eyebrow">CAMPUS WORKSPACE</span><h1>Student success, connected.</h1></div><div className="topbar-status"><span className="status-dot" /> System online</div></header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
