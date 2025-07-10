import { db, generateId } from '../lib/database';

interface Course {
  id: string;
  courseName: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCourseInput {
  courseName: string;
}

interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  errors?: Record<string, string[]>;
}

const queries = {
  getAllCourses: db.prepare('SELECT * FROM courses ORDER BY createdAt DESC'),
  getCourseById: db.prepare('SELECT * FROM courses WHERE id = ?'),
  insertCourse: db.prepare(`
    INSERT INTO courses (id, courseName, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `),
  deleteCourse: db.prepare('DELETE FROM courses WHERE id = ?')
};

export const getAllCourses = async (): Promise<ServiceResponse<Course[]>> => {
  try {
    const courses = queries.getAllCourses.all() as Course[];

    return {
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
      statusCode: 200,
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return {
      success: false,
      message: 'Failed to fetch courses',
      data: null,
      statusCode: 500,
    };
  }
};

export const getCourseById = async (id: string): Promise<ServiceResponse<Course>> => {
  try {
    if (!id?.trim()) {
      return {
        success: false,
        message: 'Invalid course ID',
        data: null,
        statusCode: 400,
      };
    }

    const course = queries.getCourseById.get(id) as Course | undefined;

    return {
      success: !!course,
      message: course ? 'Course found' : 'Course not found',
      data: course || null,
      statusCode: course ? 200 : 404,
    };
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return {
      success: false,
      message: 'Failed to fetch course',
      data: null,
      statusCode: 500,
    };
  }
};

export const createCourse = async (data: CreateCourseInput): Promise<ServiceResponse<Course>> => {
  try {
    const id = generateId();
    const now = new Date().toISOString();

    queries.insertCourse.run(id, data.courseName, now, now);

    const course = queries.getCourseById.get(id) as Course;

    return {
      success: true,
      message: 'Course created successfully',
      data: course,
      statusCode: 201,
    };
  } catch (error: any) {
    console.error('Error creating course:', error);

    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        success: false,
        message: 'Invalid request data',
        data: null,
        statusCode: 409,
        errors: {
          courseName: ['This course name is already registered. Please use a different name.'],
        },
      };
    }

    return {
      success: false,
      message: 'Failed to create course',
      data: null,
      statusCode: 500,
    };
  }
};

export const deleteCourse = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    if (!id?.trim()) {
      return {
        success: false,
        message: 'Invalid course ID',
        data: null,
        statusCode: 400,
      };
    }

    const result = queries.deleteCourse.run(id);

    return {
      success: result.changes > 0,
      message: result.changes > 0 ? 'Course deleted successfully' : 'Course not found',
      data: null,
      statusCode: result.changes > 0 ? 204 : 404,
    };
  } catch (error) {
    console.error('Error deleting course:', error);
    return {
      success: false,
      message: 'Failed to delete course',
      data: null,
      statusCode: 500,
    };
  }
};