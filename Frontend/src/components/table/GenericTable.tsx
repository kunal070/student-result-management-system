import React, { useState, useMemo } from 'react';
import LoadingSkeleton from '../table/LoadingSkeleton';
import { Users, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  itemsPerPage?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  getSearchableText?: (item: T) => string;
}

export function GenericTable<T>({
  data,
  columns,
  isLoading = false,
  itemsPerPage = 10,
  showSearch = false,
  searchPlaceholder = "Search...",
  title,
  subtitle,
  getSearchableText,
}: Props<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const filteredData = useMemo(() => {
    if (!searchQuery || !showSearch) return data;
    
    const lower = searchQuery.toLowerCase();
    return data.filter((item) => {
      if (getSearchableText) {
        return getSearchableText(item).toLowerCase().includes(lower);
      }
      
      return Object.values(item as any).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(lower)
      );
    });
  }, [searchQuery, data, showSearch, getSearchableText]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = (a as any)[sortConfig.key];
      const bVal = (b as any)[sortConfig.key];
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Auto-navigate to previous page when current page becomes empty
  React.useEffect(() => {
    if (sortedData.length > 0 && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [sortedData.length, currentPage, totalPages]);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    
    buttons.push(
      <button
        key={1}
        onClick={() => setCurrentPage(1)}
        className={`px-3 py-2 text-sm font-medium rounded-md ${
          currentPage === 1
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
        }`}
      >
        1
      </button>
    );

    if (totalPages <= maxVisible) {
      for (let i = 2; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === i
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-500">...</span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === i
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {i}
            </button>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-gray-500">...</span>
        );
      }

      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      {(title || showSearch) && (
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {isLoading ? 'Loading...' : subtitle}
              </p>
            )}
            {!subtitle && (
              <p className="text-sm text-gray-600">
                {isLoading ? 'Loading...' : `${sortedData.length} record(s) found`}
              </p>
            )}
          </div>
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 text-sm"
              />
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                    col.width || ''
                  } ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig?.key === col.key && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <LoadingSkeleton rows={itemsPerPage} cols={columns.length} />
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <Users className="w-12 h-12 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                      <p className="text-sm text-gray-500">
                        {searchQuery ? 'Try a different search' : 'Try adding some data to begin'}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.render
                        ? col.render((row as any)[col.key], row)
                        : String((row as any)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}