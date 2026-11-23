import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Login from "./login";
import Register from "./register";
import ForgotPassword from "./ForgotPassword";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedUser");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState("login");
  const [activePage, setActivePage] = useState("dashboard");
  const [tasks, setTasks] = useState(() => {
    const savedUser = localStorage.getItem("loggedUser");
    try {
      if (!savedUser) return [];
      const currentUser = JSON.parse(savedUser);
      const savedTasks = localStorage.getItem("tasks_" + currentUser.email);
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [task, setTask] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [taskCategory, setTaskCategory] = useState("Study");

  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editCategory, setEditCategory] = useState("Study");

  useEffect(() => {
    if (user) {
      localStorage.setItem("tasks_" + user.email, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const resetTaskControls = () => {
    setTask("");
    setTaskDescription("");
    setTaskNotes("");
    setTaskDate("");
    setPriority("Medium");
    setTaskCategory("Study");
    setFilter("All");
    setCategoryFilter("All");
    setSearchTerm("");
    setSortBy("default");
    setEditingTask(null);
  };

  const handleLogin = (loggedUser) => {
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    setUser(loggedUser);
    const savedTasks = localStorage.getItem("tasks_" + loggedUser.email);
    try {
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    } catch {
      setTasks([]);
    }
    resetTaskControls();
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
    setTasks([]);
    resetTaskControls();
    setActivePage("dashboard");
    setPage("login");
  };

  const addTask = () => {
    if (!task.trim()) {
      alert("Please enter a task!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: task.trim(),
      description: taskDescription.trim(),
      notes: taskNotes.trim(),
      dueDate: taskDate,
      priority,
      category: taskCategory,
      completed: false,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
    setTask("");
    setTaskDescription("");
    setTaskNotes("");
    setTaskDate("");
    setPriority("Medium");
    setTaskCategory("Study");
  };

  const deleteTask = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setTasks((previousTasks) => previousTasks.filter((item) => item.id !== id));
    if (editingTask === id) setEditingTask(null);
  };

  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const editTask = (item) => {
    setEditingTask(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description || "");
    setEditNotes(item.notes || "");
    setEditDate(item.dueDate || "");
    setEditPriority(item.priority || "Medium");
    setEditCategory(item.category || "Study");
  };

  const saveEditedTask = () => {
    if (!editTitle.trim()) {
      alert("Please enter task title!");
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === editingTask
          ? {
              ...item,
              title: editTitle.trim(),
              description: editDescription.trim(),
              notes: editNotes.trim(),
              dueDate: editDate,
              priority: editPriority,
              category: editCategory,
            }
          : item
      )
    );
    setEditingTask(null);
    alert("Task updated successfully!");
  };

  const exportTasks = () => {
    if (tasks.length === 0) {
      alert("No tasks available to export!");
      return;
    }

    const headers = ["Task Title", "Description", "Notes", "Due Date", "Priority", "Category", "Status"];
    const rows = tasks.map((item) => [
      item.title,
      item.description || "",
      item.notes || "",
      item.dueDate || "Not set",
      item.priority || "Medium",
      item.category || "Study",
      item.completed ? "Completed" : "Pending",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "My_Tasks.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearCompletedTasks = () => {
    const completedCount = tasks.filter((item) => item.completed).length;
    if (completedCount === 0) {
      alert("No completed tasks to clear!");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete all completed tasks?"
      )
    ) {
      setTasks((previousTasks) =>
        previousTasks.filter((item) => !item.completed)
      );
      alert("Completed tasks cleared successfully!");
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((item) => item.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const overdueTasks = tasks.filter(
    (item) => item.dueDate && item.dueDate < todayString && !item.completed
  );
  const todayTasks = tasks.filter(
    (item) => item.dueDate === todayString && !item.completed
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" ||
        (item.category || "Study") === categoryFilter;
      const matchesStatus =
        filter === "All" ||
        (filter === "Completed" && item.completed) ||
        (filter === "Pending" && !item.completed);
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [tasks, categoryFilter, filter, searchTerm]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === "priority") {
        const order = { High: 1, Medium: 2, Low: 3 };
        return (
          (order[a.priority || "Medium"] || 2) -
          (order[b.priority || "Medium"] || 2)
        );
      }
      if (sortBy === "date") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.id - a.id;
    });
  }, [filteredTasks, sortBy]);

  const categoryCounts = ["Study", "Work", "Personal"].map((category) => ({
    name: category,
    count: tasks.filter((item) => (item.category || "Study") === category).length,
  }));

  if (!user) {
    if (page === "register") {
      return (
        <Register
          onLogin={handleLogin}
          onRegister={() => setPage("login")}
        />
      );
    }

    if (page === "forgot") {
      return <ForgotPassword onBack={() => setPage("login")} />;
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setPage("register")}
        onForgot={() => setPage("forgot")}
      />
    );
  }

  const renderTask = (item) => (
    <article className="task-card" key={item.id}>
      <button
        className={`task-check ${item.completed ? "is-complete" : ""}`}
        onClick={() => toggleTask(item.id)}
        aria-label={item.completed ? "Mark task pending" : "Complete task"}
        title={item.completed ? "Undo completion" : "Mark complete"}
      >
        {item.completed ? "✓" : ""}
      </button>

      <div className="task-card-content">
        <h3 className={item.completed ? "task-title completed" : "task-title"}>
          {item.title}
        </h3>
        {item.description && <p className="task-description">{item.description}</p>}
        {item.notes && <p className="task-notes"><strong>Notes:</strong> {item.notes}</p>}
        <div className="task-meta">
          <span>📅 {item.dueDate ? new Date(item.dueDate + "T00:00:00").toLocaleDateString() : "No due date"}</span>
          <span className={`priority-badge priority-${(item.priority || "Medium").toLowerCase()}`}>
            {item.priority || "Medium"}
          </span>
          <span className="category-badge">{item.category || "Study"}</span>
          {!item.completed && item.dueDate && (
            <span className={`deadline-status ${item.dueDate < todayString ? "is-overdue" : ""}`}>
              {item.dueDate < todayString
                ? "Overdue"
                : item.dueDate === todayString
                ? "Due Today"
                : "Upcoming"}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="text-button" onClick={() => editTask(item)}>Edit</button>
        <button className="text-button delete-text" onClick={() => deleteTask(item.id)}>Delete</button>
      </div>
    </article>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✓</div>
          <span>TaskFlow</span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>
        <nav className="sidebar-nav">
          <button
            className={activePage === "dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("dashboard")}
          >
            <span className="nav-icon">▦</span> Dashboard
          </button>
          <button
            className={activePage === "tasks" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("tasks")}
          >
            <span className="nav-icon">☷</span> My Tasks
            <span className="nav-count">{pendingTasks}</span>
          </button>
          <button
            className={activePage === "profile" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("profile")}
          >
            <span className="nav-icon">♙</span> My Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">{(user.name || user.email || "U").charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <strong>{user.name || "User"}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>↪ Log out</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>
              {activePage === "dashboard"
                ? "Dashboard"
                : activePage === "tasks"
                ? "My Tasks"
                : "My Profile"}
            </h1>
          </div>
          <div className="topbar-date">
            <span className="topbar-date-icon">◷</span>
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </header>

        {activePage === "dashboard" && (
          <>
            <section className="welcome-panel">
              <div>
                <p className="welcome-kicker">LET'S GET THINGS DONE</p>
                <h2>Welcome back, {user.name || "there"}!</h2>
                <p>Stay focused, keep organized, and make today productive.</p>
                <button className="primary-button welcome-button" onClick={() => setActivePage("tasks")}>
                  View my tasks <span>→</span>
                </button>
              </div>
              <div className="welcome-decoration" aria-hidden="true">
                <div className="deco-circle deco-one"></div>
                <div className="deco-circle deco-two"></div>
                <div className="deco-check">✓</div>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-top"><span>Total tasks</span><span className="stat-icon purple">▤</span></div>
                <strong>{totalTasks}</strong>
                <small>All your tasks</small>
              </div>
              <div className="stat-card">
                <div className="stat-top"><span>Completed</span><span className="stat-icon green">✓</span></div>
                <strong>{completedTasks}</strong>
                <small>Successfully finished</small>
              </div>
              <div className="stat-card">
                <div className="stat-top"><span>Pending</span><span className="stat-icon orange">◷</span></div>
                <strong>{pendingTasks}</strong>
                <small>Still to be done</small>
              </div>
              <div className="stat-card">
                <div className="stat-top"><span>Overdue</span><span className="stat-icon red">!</span></div>
                <strong>{overdueTasks.length}</strong>
                <small>Past due date</small>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel progress-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">YOUR PERFORMANCE</p><h2>Task progress</h2></div>
                  <span className="progress-percent">{progress}%</span>
                </div>
                <div className="large-progress-track">
                  <div className="large-progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-footer">
                  <span>{completedTasks} completed</span>
                  <span>{pendingTasks} remaining</span>
                </div>
                <div className="progress-message">
                  {totalTasks === 0
                    ? "Add your first task to start tracking your progress."
                    : progress === 100
                    ? "Excellent work! You completed every task."
                    : "Keep going. Every completed task moves you forward!"}
                </div>
              </div>

              <div className="panel deadline-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">STAY ON TRACK</p><h2>Deadlines</h2></div>
                  <span className="panel-symbol">◷</span>
                </div>
                <div className="deadline-row">
                  <span className="deadline-dot red-dot"></span>
                  <span>Overdue tasks</span>
                  <strong>{overdueTasks.length}</strong>
                </div>
                <div className="deadline-row">
                  <span className="deadline-dot purple-dot"></span>
                  <span>Due today</span>
                  <strong>{todayTasks.length}</strong>
                </div>
              </div>
            </section>

            <section className="panel category-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">TASK ORGANIZATION</p><h2>Categories</h2></div>
                <button className="text-button" onClick={() => setActivePage("tasks")}>View tasks →</button>
              </div>
              <div className="category-grid">
                {categoryCounts.map((category) => (
                  <button
                    className="category-tile"
                    key={category.name}
                    onClick={() => {
                      setCategoryFilter(category.name);
                      setActivePage("tasks");
                    }}
                  >
                    <span className={`category-symbol ${category.name.toLowerCase()}`}>
                      {category.name === "Study" ? "▤" : category.name === "Work" ? "▣" : "♡"}
                    </span>
                    <span><strong>{category.name}</strong><small>{category.count} tasks</small></span>
                    <span className="category-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel recent-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">YOUR LATEST WORK</p><h2>Recent tasks</h2></div>
                <button className="text-button" onClick={() => setActivePage("tasks")}>See all →</button>
              </div>
              <div className="task-list">
                {tasks.length === 0 ? (
                  <div className="empty-state"><span>✦</span><h3>No tasks yet</h3><p>Add a task to see it here.</p></div>
                ) : (
                  [...tasks].sort((a, b) => b.id - a.id).slice(0, 4).map(renderTask)
                )}
              </div>
            </section>
          </>
        )}

        {activePage === "tasks" && (
          <>
            <section className="panel task-manager-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">PLAN YOUR DAY</p><h2>Add a new task</h2></div>
              </div>
              <div className="task-form">
                <input
                  type="text"
                  placeholder="What do you need to do?"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <textarea
                  className="task-extra-field"
                  placeholder="Description (optional)"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows="2"
                />
                <textarea
                  className="task-extra-field"
                  placeholder="Notes / reminders (optional)"
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  rows="2"
                />
                <input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High priority</option>
                  <option value="Medium">Medium priority</option>
                  <option value="Low">Low priority</option>
                </select>
                <select value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)}>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
                <button className="primary-button" onClick={addTask}>+ Add task</button>
              </div>
            </section>

            <section className="panel all-tasks-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">TASK OVERVIEW</p><h2>All tasks <span className="heading-count">{totalTasks}</span></h2></div>
                <div className="task-tools">
                  <button className="secondary-button" onClick={exportTasks}>↓ Export CSV</button>
                  <button className="secondary-button danger-outline" onClick={clearCompletedTasks}>Clear completed</button>
                </div>
              </div>

              <div className="task-toolbar">
                <input
                  type="search"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All categories</option>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Newest first</option>
                  <option value="priority">Priority</option>
                  <option value="date">Due date</option>
                </select>
              </div>

              <div className="filter-tabs">
                {["All", "Pending", "Completed"].map((value) => (
                  <button
                    key={value}
                    className={filter === value ? "filter-tab active" : "filter-tab"}
                    onClick={() => setFilter(value)}
                  >
                    {value}
                    {value === "All" ? ` (${totalTasks})` : value === "Pending" ? ` (${pendingTasks})` : ` (${completedTasks})`}
                  </button>
                ))}
              </div>

              {editingTask !== null && (
                <div className="edit-panel">
                  <div className="panel-heading"><h2>Edit task</h2><button className="text-button" onClick={() => setEditingTask(null)}>Cancel</button></div>
                  <div className="task-form edit-form">
                    <input type="text" placeholder="Task title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <textarea className="task-extra-field" placeholder="Description (optional)" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows="2" />
                    <textarea className="task-extra-field" placeholder="Notes / reminders (optional)" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows="2" />
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                      <option value="High">High priority</option>
                      <option value="Medium">Medium priority</option>
                      <option value="Low">Low priority</option>
                    </select>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                      <option value="Study">Study</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                    </select>
                    <button className="primary-button" onClick={saveEditedTask}>Save changes</button>
                  </div>
                </div>
              )}

              <div className="task-list">
                {sortedTasks.length === 0 ? (
                  <div className="empty-state"><span>⌕</span><h3>No tasks found</h3><p>Try changing your search or filters, or add a new task.</p></div>
                ) : sortedTasks.map(renderTask)}
              </div>
            </section>
          </>
        )}

        {activePage === "profile" && (
          <section className="panel profile-panel">
            <div className="profile-cover">
              <div className="profile-avatar">{(user.name || user.email || "U").charAt(0).toUpperCase()}</div>
            </div>
            <div className="profile-body">
              <p className="eyebrow">ACCOUNT DETAILS</p>
              <h2>{user.name || "User"}</h2>
              <p className="profile-email">{user.email}</p>
              <div className="profile-stats">
                <div><strong>{totalTasks}</strong><span>Total tasks</span></div>
                <div><strong>{completedTasks}</strong><span>Completed</span></div>
                <div><strong>{pendingTasks}</strong><span>Pending</span></div>
              </div>
              <button className="secondary-button" onClick={handleLogout}>Log out</button>
            </div>
          </section>
        )}

        <footer className="app-footer">TaskFlow <span>·</span> Stay organized. Stay productive.</footer>
      </main>
    </div>
  );
}

export default App;
