import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { BookOpen, Plus, Search, X, Trash2, Pencil, GraduationCap } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { errorMessage } from '../utils/errors';

type Course = { id: number; title: string; code: string; description: string | null; instructor: string; credits: number; createdAt: string };
type CourseForm = { title: string; code: string; description: string; instructor: string; credits: number };
const emptyForm: CourseForm = { title: '', code: '', description: '', instructor: '', credits: 3 };

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [enrolled, setEnrolled] = useState<number[]>([]);
  const canManage = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  const load = useCallback(async () => {
    try { const { data } = await api.get<Course[]>('/courses'); setCourses(data); setError(''); }
    catch (e) { setError(errorMessage(e)); }
  }, []);

  useEffect(() => { void load(); if (user?.role === 'STUDENT') api.get('/enrollments').then(({ data }) => setEnrolled(data.map((e: { courseId: number }) => e.courseId))).catch(() => {}); }, [load, user?.role]);

  function startCreate() { setEditing(null); setForm(emptyForm); setShowForm(true); setNotice(''); }
  function startEdit(course: Course) {
    setEditing(course);
    setForm({ title: course.title, code: course.code, description: course.description || '', instructor: course.instructor, credits: course.credits });
    setShowForm(true); setNotice('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      if (editing) await api.put(`/courses/${editing.id}`, form);
      else await api.post('/courses', form);
      setShowForm(false); setNotice(editing ? 'Course updated.' : 'Course created.'); await load();
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }

  async function toggleEnrollment(course: Course) {
    try { if (enrolled.includes(course.id)) { await api.delete(`/enrollments/${course.id}`); setEnrolled(current => current.filter(id => id !== course.id)); setNotice(`Unenrolled from ${course.code}.`); } else { await api.post(`/enrollments/${course.id}`); setEnrolled(current => [...current, course.id]); setNotice(`Enrolled in ${course.code}.`); } } catch (e) { setError(errorMessage(e)); }
  }

  async function remove(course: Course) {
    if (!window.confirm(`Delete ${course.code} — ${course.title}?`)) return;
    try { await api.delete(`/courses/${course.id}`); setNotice('Course deleted.'); await load(); }
    catch (e) { setError(errorMessage(e)); }
  }

  const filtered = courses.filter(c => `${c.title} ${c.code} ${c.instructor}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="courses-page">
    <div className="page-title-row"><div><span className="eyebrow">ACADEMIC CATALOGUE</span><h2>Courses</h2><p className="muted">Explore course offerings and credit details.</p></div>{canManage && <button className="primary-button" onClick={startCreate}><Plus size={17} /> Add course</button>}</div>
    {error && <div className="alert">{error}</div>}{notice && <div className="success-alert">{notice}</div>}
    <div className="catalog-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by course, code, instructor…" /></div><span className="muted">{filtered.length} course{filtered.length === 1 ? '' : 's'}</span></div>
    {filtered.length === 0 ? <div className="empty-state"><BookOpen size={32} /><h3>No courses found</h3><p>Courses will appear here after they are added to the catalogue.</p>{canManage && <button className="primary-button" onClick={startCreate}><Plus size={16} /> Add first course</button>}</div> :
      <div className="course-grid">{filtered.map((course, i) => <article className="course-card" key={course.id}><div className={`course-accent accent-${i % 4}`}><GraduationCap size={25} /><span>{course.credits} CREDITS</span></div><div className="course-card-body"><span className="course-code">{course.code}</span><h3>{course.title}</h3><p>{course.description || 'No description provided.'}</p><div className="instructor"><div className="mini-avatar">{course.instructor.slice(0, 1).toUpperCase()}</div><div><span>INSTRUCTOR</span><strong>{course.instructor}</strong></div></div>{user?.role === 'STUDENT' && <button className={enrolled.includes(course.id) ? 'secondary-button' : 'primary-button'} onClick={() => void toggleEnrollment(course)}>{enrolled.includes(course.id) ? 'Unenroll' : 'Enroll in course'}</button>}{(canManage || user?.role === 'ADMIN') && <div className="course-actions">{canManage && <button className="text-button" onClick={() => startEdit(course)}><Pencil size={14} /> Edit</button>}{user?.role === 'ADMIN' && <button className="text-button danger-text" onClick={() => void remove(course)}><Trash2 size={14} /> Delete</button>}</div>}</div></article>)}</div>}
    {showForm && <div className="modal-backdrop" role="presentation"><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="course-modal-title"><div className="modal-heading"><div><span className="eyebrow">COURSE DETAILS</span><h2 id="course-modal-title">{editing ? 'Edit course' : 'Add course'}</h2></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={20} /></button></div><form onSubmit={submit} className="course-form"><label>Course title<input required maxLength={160} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><div className="form-row"><label>Course code<input required maxLength={30} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} /></label><label>Credits<select value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })}>{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}</select></label></div><label>Instructor<input required maxLength={100} value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} /></label><label>Description<textarea rows={3} maxLength={2000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>{error && <div className="alert">{error}</div>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create course'}</button></div></form></div></div>}
  </div>;
}
