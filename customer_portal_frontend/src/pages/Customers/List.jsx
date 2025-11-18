import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import { listCustomers } from '../../api/client';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * CustomersList renders a table of customers.
 * Error messages are suppressed; on failure a neutral empty state is shown.
 */
export default function CustomersList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listCustomers();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch {
        // Suppressed: fallback to empty table
        if (mounted) setRows([]);
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
      {!loading && (
        <Table
          columns={columns}
          data={rows}
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
        />
      )}
    </Card>
  );
}
