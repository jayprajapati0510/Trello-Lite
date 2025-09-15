import React, { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email:'', password:'' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin && onLogin(res.data.user);
      window.location.href = '/board';
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="button" type="submit">Login</button>
      </form>
      {msg && <p style={{color:'red'}}>{msg}</p>}
    </div>
  );
}
