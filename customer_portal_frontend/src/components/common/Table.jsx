import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Table renders a simple table with headers and rows.
 */
export default function Table({ columns = [], data = [], rowKey = 'id', onRowClick }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key || c.accessor}>{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const key = row[rowKey] ?? JSON.stringify(row);
            return (
              <tr key={key} style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  onClick={() => onRowClick && onRowClick(row)}>
                {columns.map((c) => (
                  <td key={c.key || c.accessor}>
                    {typeof c.render === 'function' ? c.render(row) : row[c.accessor]}
                  </td>
                ))}
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} style={{ color: 'var(--muted)' }}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
