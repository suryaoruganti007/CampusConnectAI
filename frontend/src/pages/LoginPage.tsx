import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { errorMessage } from '../utils/errors';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await login(email, password); navigate('/'); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }

  return <div className="auth-page"><div className="auth-art"><div className="auth-art-inner"><div className="brand-mark large"><GraduationCap size={30} /></div><span className="eyebrow">CAMPUSCONNECT AI</span><h1>Your campus.<br />One connected space.</h1><p>Academic workflows and AI-powered student support in one workspace.</p><div className="orb orb-one" /><div className="orb orb-two" /></div></div>
    <div className="auth-panel"><form className="auth-card" onSubmit={submit}><span className="eyebrow">WELCOME BACK</span><h2>Sign in</h2><p className="muted">Use your campus account to continue.</p>
      {error && <div className="alert">{error}</div>}
      <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@college.edu" /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Enter your password" /></label>
      <button className="primary-button full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <p className="auth-switch">New to CampusConnect? <Link to="/register">Create an account</Link></p>
    </form></div></div>;
}
