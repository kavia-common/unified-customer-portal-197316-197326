import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { API_BASE, health, getHealthUrl } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Dashboard shows backend health status.
 */
export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const healthUrl = getHealthUrl();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await health();
        if (mounted) setStatus(data);
      } catch (e) {
        if (mounted) setErr(e?.message || 'Error fetching health');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="System Health"
        actions={
          <small style={{ color: 'var(--muted)' }}>
            {API_BASE} · {healthUrl}
          </small>
        }
      >
        {loading && <p>Checking service...</p>}
        {!loading && err && (
          <p style={{ color: 'var(--error)' }}>Failed to load health: {err}</p>
        )}
        {!loading && !err && (
          <pre style={{ background: 'rgba(30,58,138,0.05)', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        )}
      </Card>
    </div>
  );
}
