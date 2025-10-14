import React from 'react';

const TableView = ({ data }) => {
  // If data is not an array or is empty, display a message
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={styles.container}>
        <p>No data available to display.</p>
      </div>
    );
  }

  // Extract headers from the first object's keys
  const headers = Object.keys(data[0]);

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={styles.th}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={rowIndex % 2 === 0 ? styles.trEven : styles.trOdd}>
              {headers.map((header) => (
                <td key={`${rowIndex}-${header}`} style={styles.td}>
                  {typeof row[header] === 'object' && row[header] !== null
                    ? JSON.stringify(row[header])
                    : row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Basic styling for a clean, light-mode table
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#f2f2f2',
    color: '#333',
    fontWeight: 'bold',
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  trEven: {
    backgroundColor: '#f9f9f9',
  },
  trOdd: {
    backgroundColor: '#ffffff',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
    color: '#555',
  },
};

export default TableView;