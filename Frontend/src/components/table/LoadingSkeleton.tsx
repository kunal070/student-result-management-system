import React from 'react';

const LoadingSkeleton: React.FC<{ rows: number; cols: number }> = ({ rows, cols }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <tr key={rowIdx} className="border-b border-gray-100">
        {Array.from({ length: cols }).map((_, colIdx) => (
          <td key={colIdx} className="px-6 py-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default LoadingSkeleton;
