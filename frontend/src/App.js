import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Board from './pages/Board';

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div>
      <header className="app-header">
        <div style={{fontWeight:700}}>Trello Lite (MERN)</div>
        <div className="topbar-actions">
          {user ? (
            <>
              <div>Welcome, {user.name}</div>
              <button className="button small" onClick={() => window.location.href = '/board'}>Board</button>
              <button className="button small" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="button small" onClick={() => window.location.href = '/login'}>Login</button>
              <button className="button small" onClick={() => window.location.href = '/register'}>Register</button>
            </>
          )}
        </div>
      </header>

      <div className="container">
        {/* very simple routing */}
        {window.location.pathname === '/register' && <Register onLogin={setUser} />}
        {window.location.pathname === '/login' && <Login onLogin={setUser} />}
        {window.location.pathname === '/board' && <Board user={user} />}
        {window.location.pathname === '/' && !user && (
          <div style={{textAlign:'center', marginTop:40}}>
            <h2>Welcome to Trello Lite</h2>
            <p>Use Register / Login to open the board.</p>
          </div>
        )}
        {window.location.pathname === '/' && user && <Board user={user} />}
      </div>
    </div>
  );
}

export default App;
