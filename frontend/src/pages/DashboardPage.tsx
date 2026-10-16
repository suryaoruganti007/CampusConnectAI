import { ArrowUpRight, BookOpen, Bot, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return <div className="dashboard">
    <section className="welcome-card"><div><span className="eyebrow light">YOUR CAMPUS OVERVIEW</span><h2>Welcome back, {user?.name?.split(' ')[0]}.</h2><p>Manage academic information and get answers with your campus assistant.</p><Link className="light-button" to="/assistant">Open AI assistant <ArrowUpRight size={16} /></Link></div><div className="welcome-graphic"><div className="graphic-ring ring-a" /><div className="graphic-ring ring-b" /><div className="graphic-core"><Bot size={38} /></div></div></section>
    <div className="section-heading"><div><span className="eyebrow">WORKSPACE</span><h2>Quick access</h2></div><span className="muted">Signed in as {user?.role}</span></div>
    <div className="feature-grid">
      <Link to="/courses" className="feature-card"><div className="feature-icon blue"><BookOpen size={22} /></div><span className="feature-label">ACADEMICS</span><h3>Course catalogue</h3><p>Browse available courses and inspect course details.</p><span className="feature-link">Explore courses <ArrowUpRight size={16} /></span></Link>
      <Link to="/assistant" className="feature-card"><div className="feature-icon violet"><Bot size={22} /></div><span className="feature-label">AI SUPPORT</span><h3>Campus assistant</h3><p>Ask questions and get responses from your configured AI provider.</p><span className="feature-link">Start a conversation <ArrowUpRight size={16} /></span></Link>
      <div className="feature-card static-card"><div className="feature-icon green"><ShieldCheck size={22} /></div><span className="feature-label">ACCOUNT SECURITY</span><h3>Role-based access</h3><p>Your account is protected by password hashing and JWT authentication.</p><span className="feature-link">{user?.role} account</span></div>
    </div>
    <div className="notice"><strong>Project status</strong><span>This foundation includes authentication, course management, and AI API connectivity. Attendance, assignments, and document-grounded RAG are not implemented in this starter.</span></div>
  </div>;
}
