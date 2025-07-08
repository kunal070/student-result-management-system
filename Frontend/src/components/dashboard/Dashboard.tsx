import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import StatCard from './StatCard';
import GradeDistribution from './GradeDistribution';

import { fetchStudents } from '../../api/student.api';
import { fetchCourses } from '../../api/course.api';
import { fetchResults } from '../../api/result.api';

import { handleCatchError } from '../../utils/errorHandlers';

import type { Student } from '../../types/student';
import type { Course } from '../../types/course';
import type { Result } from '../../types/result';

const GRADE_SCALE = ['A', 'B', 'C', 'D', 'E', 'F'];

const Dashboard: React.FC = () => {
  const {
    data: studentData,
    isLoading: loadingStudents,
    isError: errorStudents,
  } = useQuery<{ students: Student[] }, Error>({
    queryKey: ['students'],
    queryFn: fetchStudents,
    onError: handleCatchError,
  } as UseQueryOptions<{ students: Student[] }, Error>);

  const {
    data: courseData,
    isLoading: loadingCourses,
    isError: errorCourses,
  } = useQuery<{ data: Course[] }, Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    onError: handleCatchError,
  } as UseQueryOptions<{ data: Course[] }, Error>);

  const {
    data: resultData,
    isLoading: loadingResults,
    isError: errorResults,
  } = useQuery<{ data: Result[] }, Error>({
  queryKey: ['results'],
  queryFn: fetchResults,
  onError: handleCatchError,
} as UseQueryOptions<{ data: Result[] }, Error>);
  if (errorStudents || errorCourses || errorResults) {
    return (
      <p className="text-red-500 text-center mt-10">
        Failed to load dashboard data. Please try again later.
      </p>
    );
  }

  if (loadingStudents || loadingCourses || loadingResults) {
    return (
      <p className="text-gray-600 text-center mt-10">Loading dashboard...</p>
    );
  }

  const totalStudents = studentData?.students?.length ?? 0;
  const totalCourses = courseData?.data?.length ?? 0;
  const results = resultData?.data ?? [];

  const averageGrade = (() => {
    // Grade point calculation: A=4.0, B=3.0, C=2.0, D=1.0, E=0.5, F=0.0
    const gradeValues: Record<string, number> = {
      A: 4, B: 3, C: 2, D: 1, E: 0.5, F: 0,
    };
    if (results.length === 0) return 'N/A';
    const total = results.reduce((sum, r) => sum + (gradeValues[r.grade] ?? 0), 0);
    const avg = total / results.length;

    if (avg >= 3.7) return 'A';
    if (avg >= 3) return 'B';
    if (avg >= 2) return 'C';
    if (avg >= 1) return 'D';
    if (avg >= 0.5) return 'E';
    return 'F';
  })();

  const gradeDistribution = GRADE_SCALE.map((grade) => {
    const count = results.filter((r) => r.grade === grade).length;
    const percentage = results.length ? (count / results.length) * 100 : 0;

    const colorMap: Record<string, string> = {
      A: 'bg-emerald-500',
      B: 'bg-blue-500',
      C: 'bg-amber-500',
      D: 'bg-orange-500',
      E: 'bg-red-500',
      F: 'bg-red-700',
    };

    return {
      grade,
      count,
      percentage,
      color: colorMap[grade],
    };
  });

  return (
<div className="h-full w-full overflow-hidden bg-gray-100 px-4 md:px-6 py-8">
  <div className="w-full max-w-full mx-auto overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Students"
        value={totalStudents}
        icon={Users}
        trend="up"
        color="bg-blue-500"
      />
      <StatCard
        title="Active Courses"
        value={totalCourses}
        icon={BookOpen}
        trend="up"
        color="bg-green-500"
      />
      <StatCard
        title="Results Recorded"
        value={results.length}
        icon={Trophy}
        trend="up"
        color="bg-purple-500"
      />
      <StatCard
        title="Average Grade"
        value={averageGrade}
        icon={TrendingUp}
        trend="up"
        color="bg-orange-500"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="col-span-1 lg:col-span-2">
        <GradeDistribution gradeDistribution={gradeDistribution} />
      </div>
    </div>
  </div>
</div>

  );
};

export default Dashboard;
