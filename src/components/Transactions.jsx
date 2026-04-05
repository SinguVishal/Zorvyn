import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Plus, Filter, Edit2, Trash2, X, Download } from 'lucide-react';
import './Transactions.css';

const Transactions = () => {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction, isLoading, isPrivate } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [dateRange, setDateRange] = useState('all'); // 'all', '7days', '30days'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: '', amount: '', category: '', type: 'expense' });

  const processedTransactions = useMemo(() => {
    const today = new Date();
    
    let result = transactions.filter(t => {
      // Search
      const matchSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
      // Type
      const matchFilter = filterType === 'all' || t.type === filterType;
      
      // Date Range
      let matchDate = true;
      if (dateRange !== 'all') {
        const txDate = new Date(t.date);
        const diffTime = Math.abs(today - txDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (dateRange === '7days') matchDate = diffDays <= 7;
        if (dateRange === '30days') matchDate = diffDays <= 30;
      }
      
      return matchSearch && matchFilter && matchDate;
    });

    result.sort((a, b) => {
      if (sortOrder === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortOrder === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortOrder === 'amt-desc') return b.amount - a.amount;
      if (sortOrder === 'amt-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortOrder, dateRange]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ date: new Date().toISOString().split('T')[0], amount: '', category: '', type: 'expense' });
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingId(tx.id);
    setFormData({ ...tx });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.amount || !formData.category) return;
    const payload = { ...formData, amount: Number(formData.amount) };
    if (editingId) editTransaction(editingId, payload);
    else addTransaction(payload);
    closeModal();
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Category', 'Type', 'Amount'];
    const rows = processedTransactions.map(tx => [
      tx.date,
      `"${tx.category}"`,
      tx.type,
      tx.amount
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="transactions-container fade-in">
        <div className="transactions-header">
          <div className="skeleton-box skeleton-title" style={{margin: 0, width: '200px'}}></div>
          <div className="toolbar-actions">
            <div className="skeleton-box skeleton-text" style={{width: '100px', height: '36px', margin: 0}}></div>
            <div className="skeleton-box skeleton-text" style={{width: '100px', height: '36px', margin: 0}}></div>
          </div>
        </div>
        <div className="transactions-list">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="transaction-item" style={{display: 'flex', gap: '1rem'}}>
              <div className="skeleton-box" style={{width: '40px', height: '40px', borderRadius: '50%'}}></div>
              <div style={{flex: 1}}>
                <div className="skeleton-box skeleton-text" style={{width: '30%', marginBottom: '8px'}}></div>
                <div className="skeleton-box skeleton-text" style={{width: '15%', height: '1rem'}}></div>
              </div>
              <div className="skeleton-box skeleton-text" style={{width: '80px'}}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container fade-in">
      <div className="transactions-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <div className="filter-group">
            <Filter size={18} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          <div className="filter-group">
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amt-desc">Highest Amount</option>
              <option value="amt-asc">Lowest Amount</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={handleExportCSV} title="Export to CSV">
            <Download size={18} />
          </button>

          {role === 'admin' && (
            <button className="btn-primary" onClick={openAddModal}>
              <Plus size={18} />
              <span>Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      <div className="transactions-list">
        {processedTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found.</p>
          </div>
        ) : (
          processedTransactions.map(tx => (
            <div key={tx.id} className="transaction-item">
              <div className="tx-main">
                <div className={`tx-icon ${tx.type === 'income' ? 'bg-success-light icon-success' : 'bg-danger-light icon-danger'}`}>
                  {tx.type === 'income' ? <Plus size={20}/> : <Trash2 size={20} style={{display:'none'}}/>}
                  {tx.type.charAt(0).toUpperCase()}
                </div>
                <div className="tx-details">
                  <span className="tx-category">{tx.category}</span>
                  <span className="tx-date">{new Date(tx.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="tx-actions">
                <span className={`tx-amount ${tx.type === 'income' ? 'text-success' : 'text-primary'}`}>
                  {tx.type === 'income' ? '+' : '-'}{isPrivate ? '****' : `$${Number(tx.amount).toLocaleString()}`}
                </span>
                
                {role === 'admin' && (
                  <div className="admin-actions">
                    <button className="icon-btn edit" onClick={() => openEditModal(tx)}><Edit2 size={16}/></button>
                    <button className="icon-btn delete" onClick={() => deleteTransaction(tx.id)}><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Groceries" required />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
