import React from 'react';
import MenuItem from './MenuItem';

const MenuGrid = ({ items, addToCart }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px 0' }}>
    {items.map(item => (
      <MenuItem key={item.id} item={item} onAdd={addToCart} />
    ))}
  </div>
);

export default MenuGrid;
