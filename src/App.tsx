import { useEffect, useState } from 'react'
import './App.css'

type Task = { id: number; title: string; done: boolean }
type Filter = 'all' | 'active' | 'done'

const STORAGE_KEY = 'taskly.tasks'

function load(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

// Simulates a network save so the UI has a realistic delay.
function saveToServer(task: Task): Promise<Task> {
  return new Promise((resolve) => setTimeout(() => resolve(task), 400))
}

let nextId = Date.now()

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(load)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const left = tasks.filter((t) => !t.done).length

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  async function addTask() {
    const title = draft.trim()
    if (!title) return
    const saved = await saveToServer({ id: nextId++, title, done: false })
    setTasks((prev) => [...prev, saved])
    setDraft('')
  }

  function toggle(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function remove(index: number) {
    setTasks((prev) => prev.filter((_, i) => i !== index))
  }

  const visible = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done,
  )

  return (
    <main className="app">
      <header>
        <h1>Taskly</h1>
        <p className="sub">Small tasks, done.</p>
      </header>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault()
          addTask()
        }}
      >
        <input
          aria-label="New task"
          placeholder="What needs doing?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>

      <nav className="filters" aria-label="Filter tasks">
        {(['all', 'active', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            className={f === filter ? 'active' : ''}
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </nav>

      <ul className="list">
        {visible.map((t, i) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span>{t.title}</span>
            </label>
            <button className="delete" aria-label={`Delete ${t.title}`} onClick={() => remove(i)}>
              ×
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="empty">Nothing here.</li>}
      </ul>

      <footer className="count">{left} {left === 1 ? 'task' : 'tasks'} left</footer>
    </main>
  )
}
