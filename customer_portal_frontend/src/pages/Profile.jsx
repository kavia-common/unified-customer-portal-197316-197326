import React from 'react';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Profile displays user profile placeholder.
 */
export default function Profile() {
  return (
    <Card title="Profile">
      <p style={{ color: 'var(--muted)' }}>User profile details and settings will appear here.</p>
    </Card>
  );
}
