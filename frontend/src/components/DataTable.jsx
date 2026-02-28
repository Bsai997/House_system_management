import { useState, useMemo } from 'react';
import { HiSearch } from 'react-icons/hi';

const DataTable = ({ columns, data, searchFields = [], title, emptyMessage = 'No data found' }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    return data.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], row);
        return String(value || '').toLowerCase().includes(query);
      })
    );
  }, [data, search, searchFields]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = sortField.split('.').reduce((obj, key) => obj?.[key], a);
      const bVal = sortField.split('.').reduce((obj, key) => obj?.[key], b);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal || '').localeCompare(String(bVal || ''))
        : String(bVal || '').localeCompare(String(aVal || ''));
    });
  }, [filteredData, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
          {searchFields.length > 0 && (
            <div className="relative w-full sm:w-72">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`table-header px-6 py-3 ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortField === col.key && (
                      <span className="text-blue-600">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr key={row._id || idx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row, idx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
        Showing {sortedData.length} of {data.length} results
      </div>
    </div>
  );
};

export default DataTable;
