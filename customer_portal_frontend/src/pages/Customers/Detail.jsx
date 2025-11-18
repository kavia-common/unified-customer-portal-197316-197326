import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getCustomer } from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * CustomerDetail shows details for a single customer.
 * Errors are suppressed; on failure shows neutral placeholders.
 */
export default function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCustomer(id);
        if (mounted) setData(res || null);
      } catch {
        // Suppressed: rely on neutral placeholders
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const safe = (k, fallback = '—') => (data && data[k]) ? data[k] : fallback;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <Link to="/customers" className="btn ghost">← Back to Customers</Link>
      </div>
      <Card title={`Customer #${id}`}>
        {loading && <p>Loading customer...</p>}
        {!loading && (
          <div style={{ display: 'grid', gap: 8 }}>
            <div><strong>Name:</strong> {safe('name')}</div>
            <div><strong>Email:</strong> {safe('email')}</div>
            <div><strong>Phone:</strong> {safe('phone', '—')}</div>
            <div><strong>Company:</strong> {safe('company', '—')}</div>
            <div><strong>Status:</strong> {safe('status', 'inactive')}</div>
            <div style={{ marginTop: 12 }}>
              <Button variant="secondary" onClick={() => alert('Not implemented')}>Edit</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
