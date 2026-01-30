import React from 'react';

const Profile = () => (
    <div className="container" style={{ paddingTop: '120px' }}>
        <h2 className="accent-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>My Profile</h2>
        <div className="premium-card glass">
            <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Name: <span style={{ color: 'white' }}>John Doe</span></p>
            <p style={{ fontSize: '1.2rem' }}>Loyalty Tier: <span style={{ color: 'var(--accent)' }}>Gold Member</span></p>
        </div>
    </div>
);

export default Profile;
