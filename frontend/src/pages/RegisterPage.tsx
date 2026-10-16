import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { errorMessage } from '../utils/errors';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await register(name, email, password); navigate('/'); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }

  return <div className="auth-page"><div className="auth-art"><div className="auth-art-inner"><div className="brand-mark large">CC</div><span className="eyebrow">JOIN YOUR CAMPUS</span><h1>Build your next<br />academic chapter.</h1><p>Keep learning resources, course information, and AI support within reach.</p><div className="orb orb-one" /><div className="orb orb-two" /></div></div>
    <div className="auth-panel"><form className="auth-card" onSubmit={submit}><span className="eyebrow">GET STARTED</span><h2>Create account</h2><p className="muted">New registrations start with the Student role.</p>
      {error && <div className="alert">{error}</div>}
      <label>Full name<input value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} autoComplete="name" placeholder="Your full name" /></label>
      <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@college.edu" /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" /></label>
      <button className="primary-button full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
    </form></div></div>;
}
