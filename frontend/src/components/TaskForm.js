import React, { useState, useEffect } from 'react';

export default function TaskForm({ initial = {title:'', description:'', status:'todo'}, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);

  useEffect(()=> { setForm(initial); }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title) return alert('Title required');
    onSubmit(form);
    setForm({title:'', description:'', status:'todo'});
  };

  return (
    <form onSubmit={submit} style={{marginBottom:12}}>
      <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
      <textarea className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})}></textarea>
      <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <div style={{display:'flex', gap:8}}>
        <button className="button" type="submit">Save</button>
        {onCancel && <button type="button" className="button small" style={{background:'#777'}} onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
