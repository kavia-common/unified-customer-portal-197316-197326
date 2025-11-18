import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getCustomer } from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * CustomerDetail shows details for a single customer.
 */
export default function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCustomer(id);
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setErr(e?.message || 'Error fetching customer');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <Link to="/customers" className="btn ghost">← Back to Customers</Link>
      </div>
      <Card title={`Customer #${id}`}>
        {loading && <p>Loading customer...</p>}
        {!loading && err && <p style={{ color: 'var(--error)' }}>Failed to load: {err}</p>}
        {!loading && !err && data && (
          <div style={{ display: 'grid', gap: 8 }}>
            <div><strong>Name:</strong> {data.name}</div>
            <div><strong>Email:</strong> {data.email}</div>
            <div><strong>Phone:</strong> {data.phone || '-'}</div>
            <div><strong>Company:</strong> {data.company || '-'}</div>
            <div><strong>Status:</strong> {data.status || '-'}</div>
            <div style={{ marginTop: 12 }}>
              <Button variant="secondary" onClick={() => alert('Not implemented')}>Edit</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
