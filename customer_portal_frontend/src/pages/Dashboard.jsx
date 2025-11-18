import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card';
import { API_BASE, health, getHealthUrl } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Dashboard shows backend health status with diagnostics and retry.
 */
export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState(null);
  const [diag, setDiag] = useState(null);
  const [fallback, setFallback] = useState(null);
  const [loading, setLoading] = useState(true);

  const healthUrl = useMemo(() => getHealthUrl(), []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setDiag(null);
    setFallback(null);
    try {
      const data = await health();
      setStatus(data);
    } catch (e) {
      setStatus(null);
      const diagInfo = e?.diagnostics || null;
      const fb = e?.fallback || null;
      setDiag(diagInfo);
      setFallback(fb);
      setErr(e?.message || 'Error fetching health');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
    })();
    return () => { mounted = false; };
  }, [load]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="System Health"
        actions={
          <small style={{ color: 'var(--muted)' }}>
            base: {API_BASE} · health: {healthUrl}
          </small>
        }
      >
        {loading && <p>Checking service...</p>}
        {!loading && err && (
          <div style={{ display: 'grid', gap: 8 }}>
            <p style={{ color: 'var(--error)', marginBottom: 0 }}>
              Failed to load health: {err}
            </p>
            {diag && (
              <details>
                <summary>Diagnostics</summary>
                <pre style={{ background: 'rgba(220,38,38,0.06)', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
                  {JSON.stringify(diag, null, 2)}
                </pre>
              </details>
            )}
            {fallback && (
              <details>
                <summary>OpenAPI connectivity check</summary>
                <pre style={{ background: 'rgba(30,58,138,0.05)', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
                  {JSON.stringify(fallback, null, 2)}
                </pre>
                {fallback.urlTried && (
                  <a className="btn ghost" href={fallback.urlTried} target="_blank" rel="noreferrer">
                    Open API Docs JSON
                  </a>
                )}
              </details>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={load}>Retry</button>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 12 }}>
              Tip: Ensure REACT_APP_API_BASE includes protocol and port (e.g., https://host:3001/api/v1) and that the backend allows CORS for this origin.
            </p>
          </div>
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
