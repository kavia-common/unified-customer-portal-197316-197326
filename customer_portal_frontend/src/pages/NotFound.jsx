import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * NotFound is rendered for unknown routes.
 */
export default function NotFound() {
  return (
    <Card title="Page Not Found">
      <p style={{ marginBottom: 12 }}>We couldn't find what you were looking for.</p>
      <Link to="/" className="btn">Go to Dashboard</Link>
    </Card>
  );
}
