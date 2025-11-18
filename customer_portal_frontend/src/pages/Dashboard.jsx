import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card';
import { API_BASE, health, getHealthUrl, listCustomers } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Dashboard shows mock metrics, health status, and sample charts.
 * In mock mode, all data is generated locally without any network calls.
 */
export default function Dashboard() {
  const [healthData, setHealthData] = useState(null);
  const [healthErr, setHealthErr] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [custErr, setCustErr] = useState(null);

  const healthUrl = useMemo(() => getHealthUrl(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingHealth(true);
      setHealthErr(null);
      try {
        const res = await health();
        if (mounted) setHealthData(res);
      } catch (e) {
        if (mounted) setHealthErr(e?.message || 'Failed to fetch health');
      } finally {
        if (mounted) setLoadingHealth(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCustomers(true);
      setCustErr(null);
      try {
        const rows = await listCustomers();
        if (mounted) setCustomers(Array.isArray(rows) ? rows : []);
      } catch (e) {
        if (mounted) setCustErr(e?.message || 'Failed to fetch customers');
      } finally {
        if (mounted) setLoadingCustomers(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Basic derived metrics for the cards
  const totalCustomers = customers.length;
  const activeCount = customers.filter(c => c.status === 'active').length;
  const prospectCount = customers.filter(c => c.status === 'prospect').length;
  const inactiveCount = customers.filter(c => c.status === 'inactive').length;

  // Simple faux "chart" bars using divs and theme colors
  const maxVal = Math.max(1, activeCount, prospectCount, inactiveCount);
  const Bar = ({ label, value, colorVar }) => (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(30,58,138,0.08)', borderRadius: 4 }}>
        <div style={{
          width: `${Math.round((value / maxVal) * 100)}%`,
          height: 8, borderRadius: 4, background: `var(${colorVar})`,
          transition: 'width .4s ease'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <Card title="Total Customers">
          <div style={{ fontSize: 28, fontWeight: 700 }}>{loadingCustomers ? '—' : totalCustomers}</div>
          <small style={{ color: 'var(--muted)' }}>All customers in the system</small>
        </Card>
        <Card title="Active">
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--success)' }}>{loadingCustomers ? '—' : activeCount}</div>
          <small style={{ color: 'var(--muted)' }}>Currently engaged</small>
        </Card>
        <Card title="Prospects">
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--secondary)' }}>{loadingCustomers ? '—' : prospectCount}</div>
          <small style={{ color: 'var(--muted)' }}>In pipeline</small>
        </Card>
        <Card title="Inactive">
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--error)' }}>{loadingCustomers ? '—' : inactiveCount}</div>
          <small style={{ color: 'var(--muted)' }}>Dormant</small>
        </Card>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <Card
          title="Customer Breakdown"
          actions={
            <small style={{ color: 'var(--muted)' }}>
              base: {API_BASE} · health: {healthUrl}
            </small>
          }
        >
          {loadingCustomers && <p>Loading breakdown...</p>}
          {!loadingCustomers && custErr && (
            <p style={{ color: 'var(--error)' }}>Failed to load: {custErr}</p>
          )}
          {!loadingCustomers && !custErr && (
            <div style={{ display: 'grid', gap: 12 }}>
              <Bar label="Active" value={activeCount} colorVar="--success" />
              <Bar label="Prospects" value={prospectCount} colorVar="--secondary" />
              <Bar label="Inactive" value={inactiveCount} colorVar="--error" />
            </div>
          )}
        </Card>

        <Card title="System Health">
          {loadingHealth && <p>Checking service...</p>}
          {!loadingHealth && healthErr && (
            <p style={{ color: 'var(--error)' }}>Failed to load: {healthErr}</p>
          )}
          {!loadingHealth && !healthErr && (
            <div style={{ display: 'grid', gap: 6 }}>
              <div><strong>Status:</strong> {healthData?.status || 'unknown'}</div>
              <div><strong>Service:</strong> {String(healthData?.service || 'n/a')}</div>
              <div><strong>Timestamp:</strong> {healthData?.timestamp || 'n/a'}</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
