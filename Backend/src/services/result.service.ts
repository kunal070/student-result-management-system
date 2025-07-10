import { db, generateId } from '../lib/database';

interface ResultWithDetails {
  id: string;
  studentId: string;
  courseId: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  createdAt: string;
  updatedAt: string;
  student: {
    firstName: string;
    lastName: string;
    fullName: string;
  };
  course: {
    courseName: string;
  };
}

interface CreateResultInput {
  studentId: string;
  courseId: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  errors?: Record<string, string[]>;
}

const queries = {
  // for the upsert operation
  checkExisting: db.prepare(`
    SELECT id FROM results 
    WHERE studentId = ? AND courseId = ?
  `),
  
  insertResult: db.prepare(`
    INSERT INTO results (id, studentId, courseId, grade, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  updateResult: db.prepare(`
    UPDATE results 
    SET grade = ?, updatedAt = ? 
    WHERE studentId = ? AND courseId = ?
  `),
  
  deleteResult: db.prepare('DELETE FROM results WHERE id = ?')
};

export const getAllResults = async (): Promise<ServiceResponse<ResultWithDetails[]>> => {
  try {
    // Complex JOIN query
    const results = db.prepare(`
      SELECT 
        r.id, r.studentId, r.courseId, r.grade, r.createdAt, r.updatedAt,
        s.firstName, s.lastName,
        c.courseName
      FROM results r
      JOIN students s ON r.studentId = s.id
      JOIN courses c ON r.courseId = c.id
      ORDER BY r.createdAt DESC
    `).all();

    const transformedResults: ResultWithDetails[] = results.map((row: any) => ({
      id: row.id,
      studentId: row.studentId,
      courseId: row.courseId,
      grade: row.grade, 
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      student: {
        firstName: row.firstName,
        lastName: row.lastName,
        fullName: `${row.firstName} ${row.lastName}`,
      },
      course: {
        courseName: row.courseName,
      },
    }));

    return {
      success: true,
      message: 'Results retrieved successfully',
      data: transformedResults,
      statusCode: 200,
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      success: false,
      message: 'Failed to fetch results',
      data: null,
      statusCode: 500,
    };
  }
};

export const createResult = async (data: CreateResultInput): Promise<ServiceResponse<any>> => {
  try {
    const now = new Date().toISOString();

    const existingResult = queries.checkExisting.get(data.studentId, data.courseId);

    if (existingResult) {
      queries.updateResult.run(data.grade, now, data.studentId, data.courseId);

      // Complex JOIN query
      const result = db.prepare(`
        SELECT 
          r.id, r.studentId, r.courseId, r.grade, r.createdAt, r.updatedAt,
          s.firstName, s.lastName,
          c.courseName
        FROM results r
        JOIN students s ON r.studentId = s.id
        JOIN courses c ON r.courseId = c.id
        WHERE r.studentId = ? AND r.courseId = ?
      `).get(data.studentId, data.courseId) as any;

      return {
        success: true,
        message: 'Result updated successfully',
        data: result,
        statusCode: 200, 
      };
    } else {
      const id = generateId();
      
      queries.insertResult.run(id, data.studentId, data.courseId, data.grade, now, now);

      // Complex JOIN query
      const result = db.prepare(`
        SELECT 
          r.id, r.studentId, r.courseId, r.grade, r.createdAt, r.updatedAt,
          s.firstName, s.lastName,
          c.courseName
        FROM results r
        JOIN students s ON r.studentId = s.id
        JOIN courses c ON r.courseId = c.id
        WHERE r.id = ?
      `).get(id) as any;

      return {
        success: true,
        message: 'Result created successfully',
        data: result,
        statusCode: 201, 
      };
    }
  } catch (error: any) {
    console.error('Error creating/updating result:', error);

    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return {
        success: false,
        message: 'Invalid student or course ID',
        data: null,
        statusCode: 400,
      };
    }

    return {
      success: false,
      message: 'Failed to create/update result',
      data: null,
      statusCode: 500,
    };
  }
};

export const deleteResult = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    if (!id?.trim()) {
      return {
        success: false,
        message: 'Invalid result ID',
        data: null,
        statusCode: 400,
      };
    }

    const result = queries.deleteResult.run(id);

    return {
      success: result.changes > 0,
      message: result.changes > 0 ? 'Result deleted successfully' : 'Result not found',
      data: null,
      statusCode: result.changes > 0 ? 204 : 404,
    };
  } catch (error) {
    console.error('Error deleting result:', error);
    return {
      success: false,
      message: 'Failed to delete result',
      data: null,
      statusCode: 500,
    };
  }
};