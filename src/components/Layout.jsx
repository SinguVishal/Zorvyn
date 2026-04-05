import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Sun, Moon, LayoutDashboard, ReceiptText, BarChart3, Menu, X, Mail, Eye, EyeOff } from 'lucide-react';
import './Layout.css';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const { theme, toggleTheme, role, setRole, isPrivate, togglePrivacy } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'contact', label: 'Contact Team', icon: Mail },
  ];

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/Zorvyn.png" alt="Zorvyn Fintech Logo" className="sidebar-logo" />
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-area">
        {/* Header */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="page-title">{navItems.find(i => i.id === activeTab)?.label}</h1>
          </div>

          <div className="topbar-right">
            {/* Role Switcher */}
            <div className="role-switcher">
              <label htmlFor="role-select">Role:</label>
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="role-select"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="theme-toggle" onClick={togglePrivacy} aria-label="Toggle privacy">
              {isPrivate ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {/* Theme Toggle Button */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
