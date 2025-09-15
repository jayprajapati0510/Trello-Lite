import React, { useEffect, useState } from 'react';
import api from '../api';
import socket from '../socket';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function Board({ user }) {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = currentUser?.id;

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) { window.location.href = '/login'; return; }
    fetchTasks();

    socket.on('task_created', (task) => {
      // if the task belongs to current user OR general update - we add it when fetching ownership matches
      // tasks are per-user; show only if owner===currentUser
      if (task.owner === userId || task.owner?._id === userId) {
        setTasks(prev => [task, ...prev]);
      }
    });
    socket.on('task_updated', (task) => {
      if (task.owner === userId || task.owner?._id === userId) {
        setTasks(prev => prev.map(t => (t._id === task._id ? task : t)));
      }
    });
    socket.on('task_deleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t._id !== id));
    });

    return () => {
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
    };
    // eslint-disable-next-line
  }, []);

  const createTask = async (data) => {
  try {
    // default status agar missing ho
    if (!data.status) data.status = "todo";

    const res = await api.post("/tasks", data, { 
      headers: { Authorization: `Bearer ${token}` } 
    });

    if (res.data) {
      // task successfully mila
      setTasks(prev => [res.data, ...prev]);
    }
  } catch (err) {
    console.error("Task create error:", err.response?.data || err.message);
    alert("Task create failed, check console.");
  }
};


  const updateTask = async (id, data) => {
    try {
      const res = await api.put(`/tasks/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key:'todo', title: 'To Do' },
    { key:'inprogress', title: 'In Progress' },
    { key:'done', title: 'Done' }
  ];

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h2>Your Board</h2>
        <div>
          <strong>{currentUser?.name}</strong>
        </div>
      </div>

      <div style={{marginBottom:12}}>
        <h4>Create Task</h4>
        <TaskForm onSubmit={createTask} />
      </div>

      <div className="board">
        {columns.map(col => (
          <div key={col.key} className="column">
            <h3>{col.title}</h3>
            {tasks.filter(t => (t.status || 'todo') === col.key).map(task => (
              <TaskCard
                key={task._id}
                task={task}
                currentUserId={userId}
                onEdit={(t) => setEditing(t)}
                onDelete={deleteTask}
              />
            ))}
          </div>
        ))}
      </div>

      {editing && (
        <div style={{marginTop:16}}>
          <h3>Edit Task</h3>
          <TaskForm
            initial={{ title: editing.title, description: editing.description, status: editing.status }}
            onSubmit={(data) => updateTask(editing._id, data)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
    </div>
  );
}
