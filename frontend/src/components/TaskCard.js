import React from 'react';

export default function TaskCard({ task, onEdit, onDelete, currentUserId }) {
  const isOwner = task.owner === currentUserId || task.owner?._id === currentUserId;
  return (
    <div className="task">
      <strong>{task.title}</strong>
      <div style={{fontSize:13, margin:'6px 0'}}>{task.description}</div>
      <div style={{display:'flex', gap:8, justifyContent:'space-between', alignItems:'center'}}>
        <small>{new Date(task.createdAt).toLocaleString()}</small>
        <div>
          {isOwner && <button className="button small" onClick={() => onEdit(task)}>Edit</button>}
          {isOwner && <button className="button small" style={{marginLeft:6, background:'#e05353'}} onClick={() => onDelete(task._id)}>Delete</button>}
        </div>
      </div>
    </div>
  );
}
