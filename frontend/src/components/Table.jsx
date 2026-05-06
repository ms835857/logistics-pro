import React from 'react';

const Table = ({ columns, data, onRowClick }) => {
    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-8 text-muted">No data available</td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
