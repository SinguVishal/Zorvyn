import React, { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext();

// Helper to generate dynamic dates
const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

const initialMockTransactions = [
  { id: '1', date: getDaysAgo(0), amount: 5000, category: 'Salary', type: 'income' },
  { id: '2', date: getDaysAgo(2), amount: 120, category: 'Groceries', type: 'expense' },
  { id: '3', date: getDaysAgo(5), amount: 60, category: 'Utilities', type: 'expense' },
  { id: '4', date: getDaysAgo(15), amount: 1500, category: 'Rent', type: 'expense' },
  { id: '5', date: getDaysAgo(25), amount: 300, category: 'Entertainment', type: 'expense' },
  { id: '6', date: getDaysAgo(40), amount: 800, category: 'Freelance', type: 'income' }
];

export const AppProvider = ({ children }) => {
  // Loading State (Simulated backend delay)
  const [isLoading, setIsLoading] = useState(true);

  // Privacy State
  const [isPrivate, setIsPrivate] = useState(() => {
    return localStorage.getItem('finance-private') === 'true';
  });

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finance-theme') || 'light';
  });

  // Role state
  const [role, setRole] = useState(() => {
    return localStorage.getItem('finance-role') || 'viewer';
  });

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-transactions');
    if (saved) return JSON.parse(saved);
    return initialMockTransactions;
  });

  // Simulate network fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Persist States
  useEffect(() => {
    localStorage.setItem('finance-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finance-role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance-private', isPrivate);
  }, [isPrivate]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const togglePrivacy = () => setIsPrivate(prev => !prev);

  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString() }]);
  };

  const editTransaction = (id, updatedTx) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      isPrivate,
      togglePrivacy,
      isLoading,
      role,
      setRole,
      transactions,
      addTransaction,
      editTransaction,
      deleteTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
