import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Award, AlertTriangle, Activity } from 'lucide-react';
import './Insights.css';

const Insights = () => {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    
    // 1. Highest Spending Category
    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });
    
    let topCategory = '';
    let topCategoryAmount = 0;
    
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > topCategoryAmount) {
        topCategoryAmount = amt;
        topCategory = cat;
      }
    }

    // 2. Largest Single Transaction
    let largestTransaction = expenses.length > 0 ? expenses[0] : null;
    expenses.forEach(t => {
      if (Number(t.amount) > Number(largestTransaction.amount)) {
        largestTransaction = t;
      }
    });

    // 3. Simple Monthly Comparison (just a mock representation if all dates in same month, but let's do real logic)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    let currentMonthSpend = 0;
    let previousMonthSpend = 0;

    expenses.forEach(t => {
      const d = new Date(t.date);
      if (d.getFullYear() === currentYear) {
        if (d.getMonth() === currentMonth) {
          currentMonthSpend += Number(t.amount);
        } else if (d.getMonth() === currentMonth - 1 || (currentMonth === 0 && d.getMonth() === 11)) {
          // crude previous month logic
          previousMonthSpend += Number(t.amount);
        }
      }
    });

    let monthTrend = 0;
    if (previousMonthSpend > 0) {
      monthTrend = ((currentMonthSpend - previousMonthSpend) / previousMonthSpend) * 100;
    }

    return {
      topCategory,
      topCategoryAmount,
      largestTransaction,
      currentMonthSpend,
      monthTrend
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="insights-container fade-in">
        <div className="empty-state">Not enough data to generate insights. Add some transactions first!</div>
      </div>
    );
  }

  return (
    <div className="insights-container fade-in">
      <h2 className="insights-title">Smart Insights</h2>
      
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon bg-warning-light">
            <Award className="icon-warning" size={24}/>
          </div>
          <div className="insight-content">
            <h3>Top Spending Category</h3>
            <p>Your highest expenses are in <strong>{insights.topCategory || 'None'}</strong>.</p>
            <span className="insight-amount">${insights.topCategoryAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon bg-danger-light">
            <AlertTriangle className="icon-danger" size={24}/>
          </div>
          <div className="insight-content">
            <h3>Largest Expense</h3>
            <p>Your single largest transaction was for <strong>{insights.largestTransaction?.category || 'None'}</strong>.</p>
            <span className="insight-amount">${Number(insights.largestTransaction?.amount || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon bg-primary-light">
            <Activity className="icon-primary" size={24}/>
          </div>
          <div className="insight-content">
            <h3>Monthly Trend</h3>
            <p>Month-to-date spending vs last month.</p>
            <span className={`insight-amount ${insights.monthTrend > 0 ? 'text-danger' : 'text-success'}`}>
              {insights.monthTrend > 0 ? '+' : ''}{insights.monthTrend.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
