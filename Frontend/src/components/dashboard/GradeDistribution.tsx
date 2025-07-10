import React from 'react';

interface Grade {
  grade: string;
  color: string;
  percentage: number;
  count: number;
}

interface GradeDistributionProps {
  gradeDistribution: Grade[];
}

const GradeDistribution: React.FC<GradeDistributionProps> = ({ gradeDistribution }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-full overflow-hidden">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Grade Distribution</h2>

      <div className="flex flex-col gap-3">
        {gradeDistribution.map((grade) => (
          <div
            key={grade.grade}
            className="flex items-center gap-2 w-full max-w-full overflow-hidden"
          >
            <span className="text-sm text-gray-700 font-medium w-4 flex-shrink-0 text-center">
              {grade.grade}
            </span>

            <div className="flex-grow">
              <div className="bg-gray-200 h-2 rounded-full w-full overflow-hidden">
                <div
                  className={`${grade.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${grade.percentage}%`, maxWidth: '100%' }}
                />
              </div>
            </div>

            <span className="text-xs text-gray-600 w-4 flex-shrink-0 text-right">
              {grade.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export {GradeDistribution};
  