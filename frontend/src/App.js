import React, { useEffect, useState } from 'react';


const getApiBase = () => {
const env = process.env.REACT_APP_API_BASE;
if (env) return env;
// When running in k8s the backend service name is `backend`
if (window.location.hostname.endsWith('.local') || window.location.hostname === 'localhost') {
return 'http://localhost:4000/api';
}
return 'http://backend:4000/api';
};


function App() {
const [todos, setTodos] = useState([]);
const [text, setText] = useState('');
const apiBase = getApiBase();


useEffect(() => {
fetch(`${apiBase}/todos`).then(r => r.json()).then(setTodos).catch(console.error);
}, []);


const add = async () => {
if (!text) return;
const res = await fetch(`${apiBase}/todos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: text }) });
const created = await res.json();
setTodos(prev => [...prev, created]);
setText('');
};


const toggle = async (id, done) => {
await fetch(`${apiBase}/todos/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ done: !done }) });
setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !done } : t));
};


const remove = async (id) => {
await fetch(`${apiBase}/todos/${id}`, { method: 'DELETE' });
setTodos(prev => prev.filter(t => t.id !== id));
};


return (
<div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
<h1>Todo App (React)</h1>
<div style={{ display: 'flex', gap: 8 }}>
<input value={text} onChange={e => setText(e.target.value)} placeholder="New todo" style={{ flex: 1, padding: 8 }} />
<button onClick={add} style={{ padding: '8px 12px' }}>Add</button>
</div>
<ul>
{todos.map(t => (
<li key={t.id} style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
<div>
<input type="checkbox" checked={t.done} onChange={() => toggle(t.id, t.done)} />
<span style={{ marginLeft: 8, textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
</div>
<button onClick={() => remove(t.id)}>Delete</button>
</li>
))}
</ul>
</div>
);
}


export default App;