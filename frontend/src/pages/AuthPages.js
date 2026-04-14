import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/UIComponents';
import styles from './AuthPages.module.css';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    if (!form.email) return setErrors({ email: 'Email is required' });
    if (!form.password) return setErrors({ password: 'Password is required' });
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/home" className={styles.logo}>
          <span className={styles.logoBox}>S</span>
          <span>Smartlytics</span>
        </Link>
        <h2 className={styles.title}>Sign in to your account</h2>
        <form className={styles.form} onSubmit={submit}>
          <Input label="Business Email" name="email" type="email" value={form.email} onChange={handle}
            placeholder="you@email.com" error={errors.email} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handle}
            placeholder="••••••••" error={errors.password} />
          <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>Sign In</Button>
        </form>
        <div className={styles.footer}>
          Don't have an account? <Link to="/register" className={styles.link}>Sign up free</Link>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    if (!form.name || form.name.length < 2) return setErrors({ name: 'Name must be at least 2 characters' });
    if (!form.email) return setErrors({ email: 'Email is required' });
    if (form.password.length < 6) return setErrors({ password: 'Password must be at least 6 characters' });
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Smartlytics 🎉');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoBox}>A</span>
          <span>Smartlytics</span>
        </Link>
        <h2 className={styles.title}>Create your free account</h2>
        <p className={styles.subtitle}>No credit card required</p>
        <form className={styles.form} onSubmit={submit}>
          <Input label="Full Name" name="name" value={form.name} onChange={handle} placeholder="John Smith" error={errors.name} />
          <Input label="Business Email" name="email" type="email" value={form.email} onChange={handle} placeholder="you@company.com" error={errors.email} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" error={errors.password} />
          <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>Create Free Account</Button>
        </form>
        <div className={styles.footer}>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </div>
        <p className={styles.terms}>
          By signing up, you agree to our <Link to="/terms" className={styles.link}>Terms of Service</Link> and <Link to="/privacy" className={styles.link}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
