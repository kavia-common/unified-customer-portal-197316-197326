import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card is a simple surface container with padding and shadow.
 */
export default function Card({ title, children, actions }) {
  return (
    <section className="card" role="region" aria-label={title || 'Card'}>
      {title && (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
          <div>{actions}</div>
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
