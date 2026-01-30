import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import '../styles/global.css';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [tracking, setTracking] = useState(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (orderId) {
            loadOrderData();
            // Poll for updates every 30 seconds
            const interval = setInterval(loadOrderData, 30000);
            return () => clearInterval(interval);
        }
    }, [orderId]);

    const loadOrderData = async () => {
        try {
            const [trackingRes, orderRes] = await Promise.all([
                ordersAPI.track(orderId),
                ordersAPI.getById(orderId)
            ]);

            if (trackingRes.success) setTracking(trackingRes.data);
            if (orderRes.success) setOrder(orderRes.data);
        } catch (err) {
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (status) => {
        const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
        return statuses.indexOf(status?.toLowerCase() || 'pending');
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loader"></div>
            </div>
        );
    }

    if (error || !tracking) {
        return (
            <div className="error-page">
                <h1>Order Not Found</h1>
                <p>We couldn't find the order you're looking for.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Go Home
                </button>
            </div>
        );
    }

    const statusIndex = getStatusIndex(tracking.currentStatus);

    return (
        <div className="tracking-page">
            {/* Navigation */}
            <nav className="tracking-nav">
                <div className="container flex-between">
                    <div className="logo" onClick={() => navigate('/')}>SAVORIA</div>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/menu')}>
                        Order More
                    </button>
                </div>
            </nav>

            <main className="container tracking-main">
                {/* Success Header */}
                {tracking.currentStatus === 'pending' || tracking.currentStatus === 'confirmed' ? (
                    <div className="success-header animate-fade-in-up">
                        <div className="success-icon">🎉</div>
                        <h1>Order Placed Successfully!</h1>
                        <p>Thank you for ordering from Savoria</p>
                    </div>
                ) : tracking.currentStatus === 'delivered' ? (
                    <div className="success-header animate-fade-in-up">
                        <div className="success-icon">✅</div>
                        <h1>Order Delivered!</h1>
                        <p>Enjoy your meal!</p>
                    </div>
                ) : (
                    <div className="success-header animate-fade-in-up">
                        <div className="success-icon">🍳</div>
                        <h1>Your Order is On Its Way!</h1>
                        <p>Estimated delivery in {tracking.estimatedDeliveryTime} minutes</p>
                    </div>
                )}

                <div className="tracking-layout">
                    {/* Order Progress */}
                    <div className="tracking-card glass animate-fade-in-up">
                        <div className="order-id-section">
                            <span className="label">Order ID</span>
                            <span className="order-id">{tracking.orderId}</span>
                        </div>

                        {/* Progress Timeline */}
                        <div className="progress-timeline">
                            {tracking.timeline.map((step, index) => (
                                <div
                                    key={index}
                                    className={`timeline-step ${step.completed ? 'completed' : ''} ${index === statusIndex ? 'current' : ''}`}
                                >
                                    <div className="step-dot">
                                        {step.completed && index !== statusIndex ? '✓' : index + 1}
                                    </div>
                                    <div className="step-content">
                                        <h4>{step.status}</h4>
                                        {step.time && (
                                            <p>{new Date(step.time).toLocaleTimeString('en-IN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</p>
                                        )}
                                    </div>
                                    {index < tracking.timeline.length - 1 && (
                                        <div className={`step-line ${step.completed ? 'completed' : ''}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Delivery Partner */}
                        {tracking.deliveryPartner && (
                            <div className="delivery-partner">
                                <h4>Your Delivery Partner</h4>
                                <div className="partner-card">
                                    <div className="partner-avatar">🛵</div>
                                    <div className="partner-info">
                                        <p className="partner-name">{tracking.deliveryPartner.name}</p>
                                        <p className="partner-vehicle">{tracking.deliveryPartner.vehicle}</p>
                                    </div>
                                    <a
                                        href={`tel:${tracking.deliveryPartner.phone}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        📞 Call
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Live Location */}
                        {tracking.liveLocation && (
                            <div className="live-location">
                                <div className="location-header">
                                    <span className="live-dot"></span>
                                    <span>Live Tracking</span>
                                </div>
                                <div className="map-placeholder">
                                    <p>📍 Your delivery person is nearby!</p>
                                    <p className="last-update">
                                        Last updated: {new Date(tracking.liveLocation.lastUpdated).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Details */}
                    {order && (
                        <div className="order-details glass animate-fade-in-up stagger-1">
                            <h3>Order Details</h3>

                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="item-qty">{item.quantity}x</span>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">₹{item.subtotal}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-breakdown">
                                <div className="breakdown-row">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Tax</span>
                                    <span>₹{order.tax.toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Delivery</span>
                                    <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="breakdown-row discount">
                                        <span>Discount</span>
                                        <span>-₹{order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="breakdown-total">
                                    <span>Total</span>
                                    <span>₹{order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="delivery-address">
                                <h4>Delivery Address</h4>
                                <p>{tracking.address || order.address}</p>
                            </div>

                            <div className="payment-info">
                                <h4>Payment</h4>
                                <p>
                                    <span className={`payment-status ${order.paymentStatus}`}>
                                        {order.paymentStatus === 'paid' ? '✓ Paid' : 'Cash on Delivery'}
                                    </span>
                                    via {order.paymentMethod?.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="tracking-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/menu')}>
                        Order Again
                    </button>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        🔄 Refresh Status
                    </button>
                </div>
            </main>

            <style>{`
        .tracking-page {
          min-height: 100vh;
          background: var(--cream);
          padding-bottom: 60px;
        }

        .tracking-nav {
          padding: 20px 0;
          background: white;
          box-shadow: var(--shadow-sm);
          margin-bottom: 40px;
        }

        .error-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
        }

        .success-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .success-header h1 {
          color: var(--charcoal);
          margin-bottom: 8px;
        }

        .success-header p {
          color: var(--text-dim);
          font-size: 1.1rem;
        }

        .tracking-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .tracking-card,
        .order-details {
          padding: 24px;
          border-radius: var(--radius-xl);
        }

        .order-id-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          margin-bottom: 24px;
        }

        .label {
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        .order-id {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
        }

        .progress-timeline {
          position: relative;
          margin-bottom: 30px;
        }

        .timeline-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 30px;
          position: relative;
        }

        .timeline-step:last-child {
          padding-bottom: 0;
        }

        .step-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-dim);
          flex-shrink: 0;
          z-index: 1;
        }

        .timeline-step.completed .step-dot {
          background: var(--primary);
          color: white;
        }

        .timeline-step.current .step-dot {
          background: var(--primary);
          color: white;
          box-shadow: 0 0 0 4px rgba(197,160,89,0.3);
          animation: pulse 2s infinite;
        }

        .step-content h4 {
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .step-content p {
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        .step-line {
          position: absolute;
          left: 17px;
          top: 36px;
          width: 2px;
          height: calc(100% - 36px);
          background: #ddd;
        }

        .step-line.completed {
          background: var(--primary);
        }

        .delivery-partner {
          padding-top: 20px;
          border-top: 1px solid #eee;
          margin-top: 20px;
        }

        .delivery-partner h4 {
          margin-bottom: 12px;
          color: var(--text-dim);
          font-size: 0.9rem;
        }

        .partner-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: white;
          border-radius: var(--radius-lg);
        }

        .partner-avatar {
          font-size: 2rem;
        }

        .partner-info {
          flex: 1;
        }

        .partner-name {
          font-weight: 600;
          color: var(--charcoal);
        }

        .partner-vehicle {
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        .live-location {
          margin-top: 20px;
          padding: 16px;
          background: white;
          border-radius: var(--radius-lg);
        }

        .location-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .live-dot {
          width: 10px;
          height: 10px;
          background: #2E7D32;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .map-placeholder {
          background: #f5f5f5;
          padding: 30px;
          text-align: center;
          border-radius: var(--radius-md);
        }

        .last-update {
          font-size: 0.8rem;
          color: var(--text-light);
          margin-top: 8px;
        }

        .order-details h3 {
          margin-bottom: 20px;
          color: var(--charcoal);
        }

        .order-items {
          margin-bottom: 20px;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .item-qty {
          background: var(--cream);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.85rem;
        }

        .item-name {
          flex: 1;
        }

        .item-price {
          font-weight: 600;
        }

        .order-breakdown {
          padding: 16px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          color: var(--text-dim);
          font-size: 0.95rem;
        }

        .breakdown-row.discount {
          color: #2E7D32;
        }

        .breakdown-total {
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1px dashed #ddd;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--charcoal);
        }

        .delivery-address,
        .payment-info {
          margin-bottom: 16px;
        }

        .delivery-address h4,
        .payment-info h4 {
          font-size: 0.85rem;
          color: var(--text-dim);
          margin-bottom: 6px;
        }

        .payment-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-right: 8px;
        }

        .payment-status.paid {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .payment-status.pending {
          background: #FFF3E0;
          color: #E65100;
        }

        .tracking-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .tracking-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .partner-card {
            flex-wrap: wrap;
          }
        }
      `}</style>
        </div>
    );
};

export default OrderTracking;
