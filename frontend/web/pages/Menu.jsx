import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuAPI, cartAPI } from '../services/api';
import '../styles/global.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    isVeg: null,
    spiceLevel: null,
    sort: null,
    search: ''
  });
  const [quickViewItem, setQuickViewItem] = useState(null);
  const navigate = useNavigate();

  // Fetch menu data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes, cartRes] = await Promise.all([
          menuAPI.getAll({ available: 'true' }),
          menuAPI.getCategories(),
          cartAPI.get()
        ]);

        if (menuRes.success) setMenuItems(menuRes.data);
        if (catRes.success) setCategories([{ id: 0, name: 'All', icon: '🍽️' }, ...catRes.data]);
        if (cartRes.success) setCartCount(cartRes.data.itemCount);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Apply filters when category or filters change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        const params = { available: 'true' };
        if (activeCategory !== 'All') params.category = activeCategory;
        if (filters.isVeg !== null) params.isVeg = filters.isVeg;
        if (filters.spiceLevel !== null) params.spiceLevel = filters.spiceLevel;
        if (filters.sort) params.sort = filters.sort;
        if (filters.search) params.search = filters.search;

        const res = await menuAPI.getAll(params);
        if (res.success) setMenuItems(res.data);
      } catch (error) {
        console.error('Failed to apply filters:', error);
      }
    };
    applyFilters();
  }, [activeCategory, filters]);

  const addToCart = async (item) => {
    try {
      const res = await cartAPI.addItem(item.id);
      if (res.success) {
        setCartCount(prev => prev + 1);
        showToast(`${item.name} added to cart!`, 'success');
      }
    } catch (error) {
      showToast('Failed to add item', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const renderSpiceLevel = (level) => {
    return '🌶️'.repeat(level) || '🍃';
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {/* Navigation */}
      <nav className="menu-nav">
        <div className="container flex-between">
          <div className="logo" onClick={() => navigate('/')}>SAVORIA</div>
          <div className="nav-right flex gap-lg">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search dishes..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="cart-btn" onClick={() => navigate('/cart')}>
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="menu-hero">
        <div className="container">
          <h1 className="hero-title animate-fade-in-up">Grand Menu</h1>
          <p className="hero-subtitle animate-fade-in-up stagger-1">
            Curated by our Master Chefs • {menuItems.length} Exquisite Dishes
          </p>
        </div>
      </header>

      {/* Filter Bar */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-bar glass">
            {/* Dietary Filters */}
            <div className="filter-group">
              <button
                className={`filter-btn ${filters.isVeg === null ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, isVeg: null })}
              >
                All
              </button>
              <button
                className={`filter-btn ${filters.isVeg === true ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, isVeg: true })}
              >
                🥬 Veg
              </button>
              <button
                className={`filter-btn ${filters.isVeg === false ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, isVeg: false })}
              >
                🍖 Non-Veg
              </button>
            </div>

            {/* Sort */}
            <select
              className="sort-select"
              value={filters.sort || ''}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value || null })}
            >
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="category-section container">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              {cat.itemCount && <span className="cat-count">{cat.itemCount}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Grid */}
      <section className="menu-section container">
        {menuItems.length === 0 ? (
          <div className="empty-state">
            <p>No dishes found matching your criteria.</p>
            <button className="btn btn-outline" onClick={() => {
              setActiveCategory('All');
              setFilters({ isVeg: null, spiceLevel: null, sort: null, search: '' });
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {menuItems.map((item, index) => (
              <div
                key={item.id}
                className={`menu-card animate-fade-in-up stagger-${(index % 4) + 1}`}
              >
                {/* Image */}
                <div
                  className="card-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                  onClick={() => setQuickViewItem(item)}
                >
                  {item.isBestseller && (
                    <span className="badge badge-bestseller">Bestseller</span>
                  )}
                  <span className={`veg-indicator ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
                </div>

                {/* Content */}
                <div className="card-content">
                  <div className="card-header">
                    <div className="card-category">{item.category}</div>
                    <div className="card-rating">
                      ⭐ {item.rating} <span>({item.ratingCount})</span>
                    </div>
                  </div>

                  <h3 className="card-title">{item.name}</h3>
                  <p className="card-desc">{item.description}</p>

                  <div className="card-meta">
                    <span className="spice-level">{renderSpiceLevel(item.spiceLevel)}</span>
                    <span className="prep-time">⏱️ {item.prepTime} min</span>
                    <span className="calories">🔥 {item.calories} cal</span>
                  </div>

                  <div className="card-footer">
                    <div className="card-price">₹{item.price}</div>
                    <button
                      className="btn btn-primary btn-sm add-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {quickViewItem && (
        <div className="quick-view-overlay" onClick={() => setQuickViewItem(null)}>
          <div className="quick-view-modal glass" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setQuickViewItem(null)}>✕</button>

            <div className="modal-image" style={{ backgroundImage: `url(${quickViewItem.image})` }}></div>

            <div className="modal-content">
              <div className="modal-badges">
                <span className={`badge ${quickViewItem.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                  {quickViewItem.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
                {quickViewItem.isBestseller && (
                  <span className="badge badge-bestseller">Bestseller</span>
                )}
              </div>

              <h2>{quickViewItem.name}</h2>
              <p className="modal-category">{quickViewItem.category}</p>
              <p className="modal-desc">{quickViewItem.description}</p>

              <div className="modal-details">
                <div className="detail-item">
                  <span className="detail-label">Spice Level</span>
                  <span className="detail-value">{renderSpiceLevel(quickViewItem.spiceLevel)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Prep Time</span>
                  <span className="detail-value">{quickViewItem.prepTime} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Calories</span>
                  <span className="detail-value">{quickViewItem.calories} kcal</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rating</span>
                  <span className="detail-value">⭐ {quickViewItem.rating} ({quickViewItem.ratingCount} reviews)</span>
                </div>
              </div>

              {quickViewItem.allergens?.length > 0 && (
                <div className="allergens">
                  <span className="allergen-label">⚠️ Allergens:</span>
                  {quickViewItem.allergens.map(a => (
                    <span key={a} className="allergen-tag">{a}</span>
                  ))}
                </div>
              )}

              <div className="modal-footer">
                <div className="modal-price">₹{quickViewItem.price}</div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    addToCart(quickViewItem);
                    setQuickViewItem(null);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .menu-page {
          min-height: 100vh;
          background: var(--cream);
        }

        .menu-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 15px 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-sm);
        }

        .nav-right {
          align-items: center;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          width: 250px;
          padding: 10px 40px 10px 16px;
          border-radius: var(--radius-full);
          border: 2px solid #eee;
        }

        .search-box input:focus {
          border-color: var(--primary);
        }

        .search-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
        }

        .cart-btn {
          position: relative;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 8px;
        }

        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--primary);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 50%;
          font-weight: 600;
        }

        .menu-hero {
          padding: 140px 0 60px;
          background: linear-gradient(135deg, var(--charcoal) 0%, #2a2a2a 100%);
          text-align: center;
        }

        .hero-title {
          color: var(--primary);
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .hero-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 1.2rem;
        }

        .filter-section {
          margin-top: -30px;
          margin-bottom: 30px;
          position: relative;
          z-index: 10;
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-radius: var(--radius-lg);
        }

        .filter-group {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 2px solid #ddd;
          background: white;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-size: 0.85rem;
          transition: var(--transition-fast);
        }

        .filter-btn:hover, .filter-btn.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }

        .sort-select {
          padding: 10px 20px;
          border-radius: var(--radius-full);
          border: 2px solid #ddd;
          background: white;
          cursor: pointer;
        }

        .category-section {
          margin-bottom: 30px;
        }

        .category-tabs {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 10px 0;
        }

        .category-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 2px solid #eee;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition-base);
          white-space: nowrap;
        }

        .category-tab:hover, .category-tab.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }

        .cat-icon {
          font-size: 1.2rem;
        }

        .cat-count {
          background: rgba(0,0,0,0.1);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .menu-section {
          padding-bottom: 80px;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .menu-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: var(--transition-base);
        }

        .menu-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .card-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
          cursor: pointer;
        }

        .card-image .badge {
          position: absolute;
          top: 12px;
          left: 12px;
        }

        .veg-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 20px;
          height: 20px;
          border: 2px solid;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .veg-indicator.veg {
          border-color: #2E7D32;
          background: white;
        }

        .veg-indicator.veg::after {
          content: '';
          width: 10px;
          height: 10px;
          background: #2E7D32;
          border-radius: 50%;
        }

        .veg-indicator.nonveg {
          border-color: #C62828;
          background: white;
        }

        .veg-indicator.nonveg::after {
          content: '';
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 10px solid #C62828;
        }

        .card-content {
          padding: 20px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .card-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--primary);
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        .card-rating {
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        .card-rating span {
          color: var(--text-light);
        }

        .card-title {
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: var(--charcoal);
        }

        .card-desc {
          font-size: 0.9rem;
          color: var(--text-dim);
          margin-bottom: 12px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #eee;
        }

        .card-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--charcoal);
        }

        .add-btn {
          padding: 10px 20px;
        }

        /* Quick View Modal */
        .quick-view-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .quick-view-modal {
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: var(--radius-xl);
          position: relative;
        }

        .close-modal {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 1.2rem;
          z-index: 10;
          box-shadow: var(--shadow-md);
        }

        .modal-image {
          height: 300px;
          background-size: cover;
          background-position: center;
        }

        .modal-content {
          padding: 24px;
        }

        .modal-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .modal-content h2 {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .modal-category {
          color: var(--primary);
          font-weight: 500;
          margin-bottom: 16px;
        }

        .modal-desc {
          margin-bottom: 20px;
        }

        .modal-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 0.75rem;
          color: var(--text-light);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .detail-value {
          font-weight: 500;
        }

        .allergens {
          background: #FFF3E0;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .allergen-label {
          font-weight: 500;
        }

        .allergen-tag {
          background: white;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .modal-price {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        @media (max-width: 768px) {
          .menu-nav .container {
            flex-direction: column;
            gap: 16px;
          }

          .search-box input {
            width: 100%;
          }

          .filter-bar {
            flex-direction: column;
            gap: 16px;
          }

          .menu-grid {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu;
