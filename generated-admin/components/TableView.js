import React from 'react';
/**
 * Renders a colored status badge.
 * Uses green for 'Active', amber for 'Pending', and red for 'Disabled'.
 */
const statusBadge = (value) => {
  const v = String(value ?? '').toLowerCase();
  const base = 'inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium';

  switch (v) {
    case 'active':
      return (
        <span className={`${base} bg-green-100 text-green-800 ring-1 ring-inset ring-green-200/50`}>
          <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          Active
        </span>
      );
    case 'pending':
      return (
        <span className={`${base} bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200/50`}>
          <svg className="h-1.5 w-1.5 fill-amber-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          Pending
        </span>
      );
    case 'disabled':
       return (
        <span className={`${base} bg-red-100 text-red-800 ring-1 ring-inset ring-red-200/50`}>
          <svg className="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          Disabled
        </span>
      );
    default:
      return (
        <span className={`${base} bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200/50`}>
          <svg className="h-1.5 w-1.5 fill-gray-400" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          {String(value ?? 'Unknown')}
        </span>
      );
  }
};


/**
 * Renders a badge for boolean values.
 * Uses green for true ('Verified') and gray for false ('Unverified').
 */
const boolBadge = (value) => {
  const truthy = !!value;
  const base = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium';
  return truthy ? (
    <span className={`${base} bg-green-100 text-green-800 ring-1 ring-inset ring-green-200/50`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
        <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.35 2.35 4.493-6.74a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  ) : (
    <span className={`${base} bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200/50`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
        <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
      </svg>
      Unverified
    </span>
  );
};


/**
 * Formats cell content based on the header key and data type.
 */
const prettyCell = (header, value) => {
  if (header.toLowerCase() === 'status') return statusBadge(value);
  if (header.toLowerCase() === 'verified') return boolBadge(value);
  
  if (typeof value === 'object' && value !== null) {
    return (
      <code className="font-mono text-[11px] text-gray-600 bg-gray-100 p-1 rounded-md whitespace-pre-wrap break-words">
        {JSON.stringify(value, null, 2)}
      </code>
    );
  }

  if (header.toLowerCase().includes('date') || header.toLowerCase().includes('at')) {
    const d = value ? new Date(value) : null;
    return (
        <div className="flex flex-col">
            <span className="text-gray-800">{d && !isNaN(d) ? d.toLocaleDateString() : String(value ?? '')}</span>
            <span className="text-xs text-gray-500">{d && !isNaN(d) ? d.toLocaleTimeString() : ''}</span>
        </div>
    );
  }
  
  if (header.toLowerCase() === 'name') {
      return (
          <div className="font-medium text-gray-900">{String(value ?? '')}</div>
      )
  }

  if (header.toLowerCase() === 'email') {
      return (
          <div className="text-gray-600">{String(value ?? '')}</div>
      )
  }

  return <span className="text-gray-700">{String(value ?? '')}</span>;
};


// --- MAIN TABLE COMPONENT  ---
const TableView = ({ data }) => {
  const rows = Array.isArray(data) && data.length > 0;

  // Dynamically generate headers from all keys in the data
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="overflow-hidden rounded-2xl border border-sky-200 bg-sky-50 shadow-lg shadow-sky-600/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sky-200/60 backdrop-blur-sm">
              <tr className="border-b border-sky-300">
                {headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-sky-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-200">
              {rows.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="hover:bg-sky-100/70 focus-within:bg-sky-100/70 transition-colors"
                >
                  {headers.map((header) => (
                    <td
                      key={`${row.id || rowIndex}-${header}`}
                      className="px-4 py-3 align-top"
                    >
                      {prettyCell(header, row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-sky-300">
                <td colSpan={headers.length} className="px-4 py-2.5 text-xs text-sky-800 bg-sky-100/80">
                  {!Array.isArray(data) || data.length === 0
                    ? 'Displaying sample data'
                    : `Total: ${rows.length} record(s)`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;

