import React from 'react';

const MenuItem = ({ item, onAdd }) => (
  <div className="card menu-item">
    <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '12px' }} />
    <div style={{ padding: '10px 0' }}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>₹{item.price}</span>
        <button className="btn btn-primary" onClick={() => onAdd(item)}>Add</button>
      </div>
    </div>
  </div>
);

export default MenuItem;
