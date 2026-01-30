import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI } from '../services/api';
import '../styles/global.css';

const Cart = () => {
    const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, deliveryFee: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(null);
    const [checkoutMode, setCheckoutMode] = useState(false);
    const [address, setAddress] = useState({
        line1: '',
        line2: '',
        city: 'Mumbai',
        pincode: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const res = await cartAPI.get();
            if (res.success) {
                setCart(res.data);
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (menuItemId, quantity) => {
        try {
            const res = await cartAPI.updateItem(menuItemId, quantity);
            if (res.success) {
                loadCart();
            }
        } catch (error) {
            console.error('Failed to update:', error);
        }
    };

    const removeItem = async (menuItemId) => {
        try {
            const res = await cartAPI.removeItem(menuItemId);
            if (res.success) {
                loadCart();
                showToast('Item removed', 'success');
            }
        } catch (error) {
            console.error('Failed to remove:', error);
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;

        try {
            const res = await cartAPI.applyCoupon(couponCode);
            if (res.success) {
                setCouponApplied(res.data);
                loadCart();
                showToast(res.message, 'success');
            } else {
                showToast(res.error, 'error');
            }
        } catch (error) {
            showToast('Failed to apply coupon', 'error');
        }
    };

    const placeOrder = async () => {
        if (!address.line1 || !address.pincode) {
            showToast('Please enter complete address', 'error');
            return;
        }

        try {
            setProcessing(true);
            const res = await ordersAPI.checkout({
                customerId: localStorage.getItem('savoria_customer_id') || 'guest',
                customerName: 'Guest User',
                customerPhone: '',
                address: `${address.line1}, ${address.line2}, ${address.city} - ${address.pincode}`,
                paymentMethod,
                notes: ''
            });

            if (res.success) {
                showToast('Order placed successfully! 🎉', 'success');
                navigate(`/order-tracking/${res.data.orderId}`);
            } else {
                showToast(res.error || 'Failed to place order', 'error');
            }
        } catch (error) {
            showToast('Order failed. Please try again.', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {/* Navigation */}
            <nav className="cart-nav">
                <div className="container flex-between">
                    <div className="logo" onClick={() => navigate('/')}>SAVORIA</div>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/menu')}>
                        ← Back to Menu
                    </button>
                </div>
            </nav>

            <main className="container cart-main">
                <h1 className="page-title animate-fade-in-up">Your Cart</h1>

                {cart.items.length === 0 ? (
                    <div className="empty-cart animate-fade-in-up">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything yet.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/menu')}>
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {cart.items.map((item, index) => (
                                <div
                                    key={item.menuItemId}
                                    className={`cart-item glass animate-fade-in-up stagger-${(index % 4) + 1}`}
                                >
                                    <div
                                        className="item-image"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    >
                                        <span className={`veg-badge ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
                                    </div>

                                    <div className="item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-price">₹{item.price} each</p>
                                    </div>

                                    <div className="quantity-control">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-subtotal">
                                        ₹{item.subtotal}
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => removeItem(item.menuItemId)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary / Checkout */}
                        <div className="order-summary glass">
                            {!checkoutMode ? (
                                <>
                                    <h3>Order Summary</h3>

                                    {/* Coupon */}
                                    <div className="coupon-section">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                        <button className="btn btn-outline btn-sm" onClick={applyCoupon}>
                                            Apply
                                        </button>
                                    </div>

                                    {couponApplied && (
                                        <div className="coupon-applied">
                                            ✓ {couponApplied.coupon.code} applied! You save ₹{couponApplied.discount}
                                        </div>
                                    )}

                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>₹{cart.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>GST (5%)</span>
                                        <span>₹{cart.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Delivery Fee</span>
                                        <span>{cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}</span>
                                    </div>
                                    {couponApplied && (
                                        <div className="summary-row discount">
                                            <span>Discount</span>
                                            <span>-₹{couponApplied.discount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="summary-total">
                                        <span>Total</span>
                                        <span>₹{(cart.total - (couponApplied?.discount || 0)).toFixed(2)}</span>
                                    </div>

                                    <button
                                        className="btn btn-primary btn-lg checkout-btn"
                                        onClick={() => setCheckoutMode(true)}
                                    >
                                        Proceed to Checkout
                                    </button>

                                    <p className="free-delivery-hint">
                                        {cart.subtotal < 500
                                            ? `Add ₹${(500 - cart.subtotal).toFixed(0)} more for FREE delivery!`
                                            : '✓ You qualify for FREE delivery!'
                                        }
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3>Delivery Details</h3>

                                    <div className="checkout-form">
                                        <div className="form-group">
                                            <label>Address Line 1 *</label>
                                            <input
                                                type="text"
                                                placeholder="Building, Street"
                                                value={address.line1}
                                                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Address Line 2</label>
                                            <input
                                                type="text"
                                                placeholder="Landmark"
                                                value={address.line2}
                                                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>City</label>
                                                <input type="text" value="Mumbai" disabled />
                                            </div>
                                            <div className="form-group">
                                                <label>Pincode *</label>
                                                <input
                                                    type="text"
                                                    placeholder="400001"
                                                    value={address.pincode}
                                                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Payment Method</label>
                                            <div className="payment-options">
                                                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="upi"
                                                        checked={paymentMethod === 'upi'}
                                                        onChange={() => setPaymentMethod('upi')}
                                                    />
                                                    <span>📱 UPI</span>
                                                </label>
                                                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="card"
                                                        checked={paymentMethod === 'card'}
                                                        onChange={() => setPaymentMethod('card')}
                                                    />
                                                    <span>💳 Card</span>
                                                </label>
                                                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="cod"
                                                        checked={paymentMethod === 'cod'}
                                                        onChange={() => setPaymentMethod('cod')}
                                                    />
                                                    <span>💵 Cash</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="checkout-total">
                                        <span>Total:</span>
                                        <span className="total-value">₹{(cart.total - (couponApplied?.discount || 0)).toFixed(2)}</span>
                                    </div>

                                    <button
                                        className="btn btn-primary btn-lg checkout-btn"
                                        onClick={placeOrder}
                                        disabled={processing}
                                    >
                                        {processing ? 'Placing Order...' : 'Place Order 🍽️'}
                                    </button>

                                    <button
                                        className="btn btn-outline back-btn"
                                        onClick={() => setCheckoutMode(false)}
                                    >
                                        ← Back to Summary
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <style>{`
        .cart-page {
          min-height: 100vh;
          background: var(--cream);
          padding-bottom: 60px;
        }

        .cart-nav {
          padding: 20px 0;
          background: white;
          box-shadow: var(--shadow-sm);
          margin-bottom: 40px;
        }

        .page-title {
          font-size: 2.5rem;
          color: var(--charcoal);
          margin-bottom: 40px;
        }

        .empty-cart {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 24px;
        }

        .empty-cart h2 {
          margin-bottom: 12px;
        }

        .empty-cart p {
          margin-bottom: 24px;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
          align-items: start;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto auto auto;
          gap: 20px;
          align-items: center;
          padding: 16px;
          border-radius: var(--radius-lg);
        }

        .item-image {
          width: 100px;
          height: 80px;
          background-size: cover;
          background-position: center;
          border-radius: var(--radius-md);
          position: relative;
        }

        .veg-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 16px;
          height: 16px;
          border: 2px solid;
          border-radius: 4px;
          background: white;
        }

        .veg-badge.veg {
          border-color: #2E7D32;
        }

        .veg-badge.veg::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: #2E7D32;
          border-radius: 50%;
        }

        .veg-badge.nonveg {
          border-color: #C62828;
        }

        .veg-badge.nonveg::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 3px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 6px solid #C62828;
        }

        .item-name {
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .item-price {
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: 2px solid #ddd;
          background: white;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:hover {
          border-color: var(--primary);
        }

        .qty-value {
          min-width: 24px;
          text-align: center;
          font-weight: 600;
        }

        .item-subtotal {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--charcoal);
        }

        .remove-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #fee;
          color: #c00;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .remove-btn:hover {
          background: #fcc;
        }

        .order-summary {
          padding: 24px;
          border-radius: var(--radius-lg);
          position: sticky;
          top: 20px;
        }

        .order-summary h3 {
          margin-bottom: 20px;
          color: var(--charcoal);
        }

        .coupon-section {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .coupon-section input {
          flex: 1;
          padding: 10px 14px;
          border-radius: var(--radius-md);
        }

        .coupon-applied {
          background: #E8F5E9;
          color: #2E7D32;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          margin-bottom: 16px;
          font-size: 0.9rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          color: var(--text-dim);
        }

        .summary-row.discount {
          color: #2E7D32;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          margin-top: 8px;
          border-top: 2px solid #eee;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--charcoal);
        }

        .checkout-btn {
          width: 100%;
          margin-top: 16px;
        }

        .free-delivery-hint {
          text-align: center;
          margin-top: 12px;
          font-size: 0.85rem;
          color: var(--primary);
        }

        .checkout-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 6px;
          color: var(--text-dim);
        }

        .form-group input {
          padding: 12px 14px;
          border: 2px solid #eee;
          border-radius: var(--radius-md);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .payment-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .payment-option {
          padding: 12px;
          border: 2px solid #eee;
          border-radius: var(--radius-md);
          text-align: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .payment-option input {
          display: none;
        }

        .payment-option.selected {
          border-color: var(--primary);
          background: rgba(197,160,89,0.1);
        }

        .checkout-total {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-top: 2px solid #eee;
          margin-bottom: 16px;
        }

        .total-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .back-btn {
          width: 100%;
          margin-top: 10px;
        }

        @media (max-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: 12px;
          }

          .quantity-control,
          .item-subtotal,
          .remove-btn {
            grid-column: span 2;
            justify-self: start;
          }
        }
      `}</style>
        </div>
    );
};

export default Cart;
