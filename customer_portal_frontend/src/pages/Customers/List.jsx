import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import { listCustomers } from '../../api/client';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * CustomersList renders a table of customers.
 */
export default function CustomersList() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listCustomers();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setErr(e?.message || 'Error fetching customers');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const columns = [
    { title: 'ID', accessor: 'id' },
    { title: 'Name', accessor: 'name' },
    { title: 'Email', accessor: 'email' },
    { title: 'Company', accessor: 'company' },
    { title: 'Status', accessor: 'status' },
  ];

  return (
    <Card title="Customers">
      {loading && <p>Loading customers...</p>}
      {!loading && err && <p style={{ color: 'var(--error)' }}>Failed to load: {err}</p>}
      {!loading && !err && (
        <Table
          columns={columns}
          data={rows}
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
        />
      )}
    </Card>
  );
}
