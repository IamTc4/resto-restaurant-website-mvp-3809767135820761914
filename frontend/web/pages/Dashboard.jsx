import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import '../styles/global.css';

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [sales, setSales] = useState(null);
    const [popularItems, setPopularItems] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [customerData, setCustomerData] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePeriod, setActivePeriod] = useState('7days');
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        loadSalesData();
    }, [activePeriod]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [dashRes, popRes, catRes, custRes, feedbackRes] = await Promise.all([
                analyticsAPI.getDashboard(),
                analyticsAPI.getPopularItems(8),
                analyticsAPI.getCategoryBreakdown(),
                analyticsAPI.getCustomerInsights(),
                analyticsAPI.getFeedback()
            ]);

            if (dashRes.success) setDashboard(dashRes.data);
            if (popRes.success) setPopularItems(popRes.data);
            if (catRes.success) setCategoryData(catRes.data);
            if (custRes.success) setCustomerData(custRes.data);
            if (feedbackRes.success) setFeedback(feedbackRes.data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSalesData = async () => {
        try {
            const res = await analyticsAPI.getSales(activePeriod);
            if (res.success) setSales(res.data);
        } catch (error) {
            console.error('Failed to load sales:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loader"></div>
            </div>
        );
    }

    const maxRevenue = sales?.salesByDay ? Math.max(...sales.salesByDay.map(d => d.revenue)) : 0;

    return (
        <div className="dashboard-page">
            {/* Navigation */}
            <nav className="dashboard-nav">
                <div className="container flex-between">
                    <div className="nav-left flex gap-lg">
                        <div className="logo" onClick={() => navigate('/')}>SAVORIA</div>
                        <span className="nav-divider">|</span>
                        <span className="nav-title">Analytics Dashboard</span>
                    </div>
                    <div className="nav-right flex gap-md">
                        <button className="btn btn-outline btn-sm" onClick={() => navigate('/menu')}>
                            View Menu
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={loadDashboardData}>
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container dashboard-main">
                {/* Header */}
                <div className="dashboard-header animate-fade-in-up">
                    <div>
                        <h1>Welcome back, Admin</h1>
                        <p>Here's what's happening with your restaurant today.</p>
                    </div>
                    <div className="date-display">
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="metrics-grid animate-fade-in-up stagger-1">
                    <div className="metric-card">
                        <div className="metric-icon">📦</div>
                        <div className="metric-content">
                            <span className="metric-value">{dashboard?.overview.totalOrders || 0}</span>
                            <span className="metric-label">Total Orders</span>
                        </div>
                        <span className="metric-change positive">{dashboard?.comparison.ordersChange}</span>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">💰</div>
                        <div className="metric-content">
                            <span className="metric-value">₹{dashboard?.overview.totalRevenue || 0}</span>
                            <span className="metric-label">Total Revenue</span>
                        </div>
                        <span className="metric-change positive">{dashboard?.comparison.revenueChange}</span>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">🧾</div>
                        <div className="metric-content">
                            <span className="metric-value">₹{dashboard?.overview.averageOrderValue || 0}</span>
                            <span className="metric-label">Avg Order Value</span>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">⭐</div>
                        <div className="metric-content">
                            <span className="metric-value">{dashboard?.overview.averageRating || 0}</span>
                            <span className="metric-label">Avg Rating</span>
                        </div>
                        <span className="metric-change positive">{dashboard?.comparison.ratingChange}</span>
                    </div>
                </div>

                {/* Today's Stats */}
                <div className="today-section animate-fade-in-up stagger-2">
                    <h3>Today's Performance</h3>
                    <div className="today-cards">
                        <div className="today-card">
                            <span className="today-label">Orders Today</span>
                            <span className="today-value">{dashboard?.today.orders || 0}</span>
                        </div>
                        <div className="today-card">
                            <span className="today-label">Revenue Today</span>
                            <span className="today-value">₹{dashboard?.today.revenue || 0}</span>
                        </div>
                        <div className="today-card highlight">
                            <span className="today-label">Pending Orders</span>
                            <span className="today-value">{dashboard?.today.pendingOrders || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Sales Chart */}
                    <div className="chart-card glass animate-fade-in-up">
                        <div className="chart-header">
                            <h3>Revenue Trends</h3>
                            <div className="period-toggle">
                                <button
                                    className={activePeriod === '7days' ? 'active' : ''}
                                    onClick={() => setActivePeriod('7days')}
                                >
                                    7 Days
                                </button>
                                <button
                                    className={activePeriod === '30days' ? 'active' : ''}
                                    onClick={() => setActivePeriod('30days')}
                                >
                                    30 Days
                                </button>
                            </div>
                        </div>

                        <div className="chart-container">
                            {sales?.salesByDay.map((day, index) => (
                                <div key={index} className="chart-bar-group">
                                    <div
                                        className="chart-bar"
                                        style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                                        title={`₹${day.revenue.toFixed(0)}`}
                                    >
                                        <span className="bar-value">₹{day.revenue.toFixed(0)}</span>
                                    </div>
                                    <span className="bar-label">{day.displayDate}</span>
                                </div>
                            ))}
                        </div>

                        <div className="chart-summary">
                            <div className="summary-item">
                                <span className="summary-label">Total</span>
                                <span className="summary-value">₹{sales?.summary.totalRevenue}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Avg/Day</span>
                                <span className="summary-value">₹{sales?.summary.avgDailyRevenue}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Orders</span>
                                <span className="summary-value">{sales?.summary.totalOrders}</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="category-card glass animate-fade-in-up stagger-1">
                        <h3>Sales by Category</h3>
                        <div className="category-list">
                            {categoryData.slice(0, 6).map((cat, index) => (
                                <div key={index} className="category-item">
                                    <div className="category-info">
                                        <span className="category-name">{cat.name}</span>
                                        <span className="category-revenue">₹{cat.revenue.toFixed(0)}</span>
                                    </div>
                                    <div className="category-bar">
                                        <div
                                            className="category-fill"
                                            style={{
                                                width: `${(cat.revenue / (categoryData[0]?.revenue || 1)) * 100}%`,
                                                background: `hsl(${40 + index * 20}, 70%, 50%)`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="category-count">{cat.items} items</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Popular Items */}
                <div className="popular-section glass animate-fade-in-up">
                    <h3>🏆 Top Selling Items</h3>
                    <div className="popular-grid">
                        {popularItems.map((item, index) => (
                            <div key={item.id} className="popular-item">
                                <span className="rank">#{index + 1}</span>
                                <div className="popular-info">
                                    <h4>{item.name}</h4>
                                    <span className="category">{item.category}</span>
                                </div>
                                <div className="popular-stats">
                                    <span className="order-count">{item.orderCount} orders</span>
                                    <span className="revenue">₹{item.revenue.toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Customer Insights */}
                    <div className="customer-card glass animate-fade-in-up">
                        <h3>👥 Customer Insights</h3>

                        <div className="customer-stats">
                            <div className="stat-item">
                                <span className="stat-value">{customerData?.totalCustomers || 0}</span>
                                <span className="stat-label">Total Customers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">₹{customerData?.averageLifetimeValue || 0}</span>
                                <span className="stat-label">Avg Lifetime Value</span>
                            </div>
                        </div>

                        <div className="tier-distribution">
                            <h4>Loyalty Tier Distribution</h4>
                            <div className="tier-bars">
                                {customerData?.tierDistribution.map((tier, index) => (
                                    <div key={tier.tier} className="tier-item">
                                        <span className="tier-name">{tier.tier}</span>
                                        <div className="tier-bar">
                                            <div
                                                className="tier-fill"
                                                style={{
                                                    width: `${(tier.count / customerData.totalCustomers) * 100}%`,
                                                    background: ['#CD7F32', '#C0C0C0', '#FFD700', '#E5E4E2'][index]
                                                }}
                                            ></div>
                                        </div>
                                        <span className="tier-count">{tier.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="top-customers">
                            <h4>Top Customers</h4>
                            {customerData?.topCustomers.slice(0, 3).map((customer, index) => (
                                <div key={customer.id} className="top-customer">
                                    <span className="customer-rank">#{index + 1}</span>
                                    <div className="customer-info">
                                        <span className="customer-name">{customer.name}</span>
                                        <span className="customer-tier badge">{customer.tier}</span>
                                    </div>
                                    <span className="customer-spent">₹{customer.totalSpent}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feedback & Reviews */}
                    <div className="feedback-card glass animate-fade-in-up stagger-1">
                        <h3>⭐ Reviews & Feedback</h3>

                        <div className="rating-overview">
                            <div className="avg-rating">
                                <span className="rating-value">{feedback?.averageRating}</span>
                                <span className="rating-stars">{'⭐'.repeat(Math.round(feedback?.averageRating || 0))}</span>
                                <span className="rating-count">{feedback?.totalReviews} reviews</span>
                            </div>

                            <div className="rating-distribution">
                                {feedback?.ratingDistribution.reverse().map(rating => (
                                    <div key={rating.stars} className="rating-row">
                                        <span className="rating-label">{rating.stars} ⭐</span>
                                        <div className="rating-bar">
                                            <div
                                                className="rating-fill"
                                                style={{ width: `${(rating.count / feedback.totalReviews) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="rating-count">{rating.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="recent-feedback">
                            <h4>Recent Feedback</h4>
                            {feedback?.recentFeedback.slice(0, 3).map((fb, index) => (
                                <div key={index} className="feedback-item">
                                    <div className="feedback-header">
                                        <span className="feedback-name">{fb.customerName}</span>
                                        <span className="feedback-rating">{'⭐'.repeat(fb.rating)}</span>
                                    </div>
                                    <p className="feedback-text">"{fb.feedback}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
          color: white;
        }

        .dashboard-nav {
          padding: 20px 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .nav-left {
          align-items: center;
        }

        .nav-divider {
          color: rgba(255,255,255,0.3);
        }

        .nav-title {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
        }

        .dashboard-main {
          padding: 40px 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .dashboard-header h1 {
          color: white;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: rgba(255,255,255,0.6);
        }

        .date-display {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }

        .metric-icon {
          font-size: 2.5rem;
        }

        .metric-content {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
        }

        .metric-label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        .metric-change {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 0.8rem;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .metric-change.positive {
          background: rgba(46,125,50,0.2);
          color: #4CAF50;
        }

        .today-section {
          margin-bottom: 30px;
        }

        .today-section h3 {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .today-cards {
          display: flex;
          gap: 20px;
        }

        .today-card {
          background: rgba(255,255,255,0.05);
          padding: 16px 24px;
          border-radius: var(--radius-md);
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .today-card.highlight {
          background: linear-gradient(135deg, rgba(197,160,89,0.3) 0%, rgba(197,160,89,0.1) 100%);
          border: 1px solid var(--primary);
        }

        .today-label {
          color: rgba(255,255,255,0.6);
          font-size: 0.85rem;
        }

        .today-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          margin-bottom: 30px;
        }

        .chart-card,
        .category-card,
        .customer-card,
        .feedback-card,
        .popular-section {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        h3 {
          color: white;
          margin-bottom: 20px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .period-toggle {
          display: flex;
          gap: 8px;
        }

        .period-toggle button {
          padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: rgba(255,255,255,0.6);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .period-toggle button.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .chart-container {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          height: 200px;
          margin-bottom: 20px;
        }

        .chart-bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .chart-bar {
          width: 100%;
          background: linear-gradient(180deg, var(--primary) 0%, rgba(197,160,89,0.5) 100%);
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          position: relative;
          min-height: 10px;
          transition: height 0.5s ease;
        }

        .bar-value {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
          white-space: nowrap;
          opacity: 0;
        }

        .chart-bar:hover .bar-value {
          opacity: 1;
        }

        .bar-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          margin-top: 8px;
        }

        .chart-summary {
          display: flex;
          justify-content: space-around;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .summary-item {
          text-align: center;
        }

        .summary-label {
          display: block;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }

        .summary-value {
          font-weight: 700;
          color: var(--primary);
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .category-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          align-items: center;
        }

        .category-info {
          display: flex;
          justify-content: space-between;
        }

        .category-name {
          color: white;
        }

        .category-revenue {
          color: var(--primary);
          font-weight: 600;
        }

        .category-bar {
          grid-column: span 2;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .category-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }

        .category-count {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }

        .popular-section {
          margin-bottom: 30px;
        }

        .popular-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .popular-item {
          background: rgba(255,255,255,0.05);
          padding: 16px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rank {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .popular-info h4 {
          color: white;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .popular-info .category {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }

        .popular-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .order-count {
          color: rgba(255,255,255,0.6);
        }

        .revenue {
          color: var(--primary);
          font-weight: 600;
        }

        .customer-stats {
          display: flex;
          gap: 30px;
          margin-bottom: 24px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        .tier-distribution,
        .top-customers,
        .rating-overview,
        .recent-feedback {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        h4 {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 12px;
        }

        .tier-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tier-item {
          display: grid;
          grid-template-columns: 80px 1fr 40px;
          gap: 12px;
          align-items: center;
        }

        .tier-name {
          font-size: 0.85rem;
          color: white;
        }

        .tier-bar {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .tier-fill {
          height: 100%;
          border-radius: var(--radius-full);
        }

        .tier-count {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          text-align: right;
        }

        .top-customer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .customer-rank {
          font-weight: 700;
          color: var(--primary);
        }

        .customer-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          color: white;
        }

        .customer-tier {
          font-size: 0.7rem;
          padding: 2px 6px;
          background: rgba(197,160,89,0.2);
          color: var(--primary);
          border-radius: var(--radius-sm);
          width: fit-content;
        }

        .customer-spent {
          font-weight: 600;
          color: var(--primary);
        }

        .avg-rating {
          text-align: center;
          margin-bottom: 20px;
        }

        .rating-value {
          font-size: 3rem;
          font-weight: 700;
          color: var(--primary);
          display: block;
        }

        .rating-stars {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 4px;
        }

        .rating-count {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        .rating-distribution {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rating-row {
          display: grid;
          grid-template-columns: 50px 1fr 40px;
          gap: 10px;
          align-items: center;
        }

        .rating-label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
        }

        .rating-bar {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .rating-fill {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .feedback-item {
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .feedback-name {
          font-weight: 500;
          color: white;
        }

        .feedback-rating {
          font-size: 0.85rem;
        }

        .feedback-text {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }

        @media (max-width: 1200px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .popular-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .today-cards {
            flex-direction: column;
          }

          .popular-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
