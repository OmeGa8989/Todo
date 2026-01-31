import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err))
  }, [])

  const addTask = async () => {
    if (!inputValue.trim()) return
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue })
      })
      const newTask = await res.json()
      setTasks([...tasks, newTask])
      setInputValue('')
    } catch (err) {
      console.error("Error adding task:", err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })
      const updatedTask = await res.json()
      setTasks(tasks.map(t =>
        t.id === id ? updatedTask : t
      ))
    } catch (err) {
      console.error("Error toggling task:", err)
    }
  }

  const startEditing = (task) => {
    setEditId(task.id)
    setEditValue(task.text)
  }

  const saveEdit = async () => {
    if (!editValue.trim()) return
    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editValue })
      })
      const updatedTask = await res.json()
      setTasks(tasks.map(t =>
        t.id === editId ? updatedTask : t
      ))
      setEditId(null)
      setEditValue('')
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditValue('')
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Task Manager</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-montserrat text-sm italic">
          What are your goals for today🚀
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-center text-zinc-500 italic py-4">No tasks yet. Add one above!</p>
        )}

        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${task.completed
              ? 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50'
              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:shadow-sm'
              }`}
          >
            {editId === task.id ? (
              <div className="flex flex-1 gap-2 items-center">
                <span className="text-zinc-400 font-mono text-sm w-6 text-right">{index + 1}.</span>
                <input
                  type="text"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  className="flex-1 px-3 py-1 text-sm rounded border border-blue-500 bg-transparent focus:outline-none"
                />
                <button onClick={saveEdit} className="p-1 text-green-600 hover:text-green-700" title="Save">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </button>
                <button onClick={cancelEdit} className="p-1 text-red-500 hover:text-red-700" title="Cancel">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <span className={`text-zinc-400 font-mono text-sm w-6 text-right flex-shrink-0 ${task.completed ? 'opacity-50' : ''}`}>{index + 1}.</span>
                  <span className={`truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-100'}`}>
                    {task.text}
                  </span>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`p-2 transition-colors ${task.completed ? 'text-green-500' : 'text-zinc-300 hover:text-green-500'}`}
                    title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                  </button>
                  <button
                    onClick={() => startEditing(task)}
                    className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.82 2.82 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
