import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import './Overview.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Overview = () => {
  const { transactions, isLoading, isPrivate } = useAppContext();

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      if (t.type === 'expense') expense += Number(t.amount);
    });
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  const trendData = useMemo(() => {
    const grouped = {};
    const sortedTx = [...transactions].sort((a,b) => new Date(a.date) - new Date(b.date));
    sortedTx.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!grouped[month]) grouped[month] = { name: month, income: 0, expense: 0 };
      if (t.type === 'income') grouped[month].income += Number(t.amount);
      if (t.type === 'expense') grouped[month].expense += Number(t.amount);
    });
    return Object.values(grouped);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenseData = transactions.filter(t => t.type === 'expense');
    const grouped = {};
    expenseData.forEach(t => {
      if (!grouped[t.category]) grouped[t.category] = 0;
      grouped[t.category] += Number(t.amount);
    });
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }, [transactions]);

  const renderAmount = (amount) => {
    return isPrivate ? '****' : `$${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="overview-container fade-in">
        <div className="summary-grid">
          {[1,2,3].map(i => (
             <div key={i} className="summary-card">
               <div className="summary-icon skeleton-box"></div>
               <div className="summary-info" style={{ flex: 1 }}>
                 <div className="skeleton-box skeleton-text"></div>
                 <div className="skeleton-box skeleton-title"></div>
               </div>
             </div>
          ))}
        </div>
        <div className="charts-grid">
           <div className="chart-card">
             <div className="skeleton-box skeleton-text"></div>
             <div className="chart-wrapper"><div className="skeleton-box skeleton-chart"></div></div>
           </div>
           <div className="chart-card">
             <div className="skeleton-box skeleton-text"></div>
             <div className="chart-wrapper"><div className="skeleton-box skeleton-chart"></div></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-container fade-in">
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon bg-primary-light"><DollarSign className="icon-primary" /></div>
          <div className="summary-info">
            <span className="summary-label">Total Balance</span>
            <h3 className="summary-value">{renderAmount(balance)}</h3>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon bg-success-light"><TrendingUp className="icon-success" /></div>
          <div className="summary-info">
            <span className="summary-label">Total Income</span>
            <h3 className="summary-value">{renderAmount(totalIncome)}</h3>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon bg-danger-light"><TrendingDown className="icon-danger" /></div>
          <div className="summary-info">
            <span className="summary-label">Total Expenses</span>
            <h3 className="summary-value">{renderAmount(totalExpense)}</h3>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Cash Flow Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => isPrivate ? '***' : `$${val}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(val) => isPrivate ? '****' : `$${val}`}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Spending Breakdown</h3>
          <div className="chart-wrapper">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    formatter={(val) => isPrivate ? '****' : `$${val}`}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="empty-chart">No expense data available</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
