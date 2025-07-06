import { db, generateId } from '../lib/database';

export const getAllCourses = async () => {
  try {
    const courses = db.prepare(`
      SELECT * FROM courses 
      ORDER BY createdAt DESC
    `).all();

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

export const getCourseById = async (id: string) => {
  try {
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);

    return {
      success: !!course,
      message: course ? 'Course found' : 'Course not found',
      data: course,
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

export const createCourse = async (data: { courseName: string }) => {
  try {
    const id = generateId();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO courses (id, courseName, createdAt, updatedAt)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, data.courseName, now, now);

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);

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

export const deleteCourse = async (id: string) => {
  try {
    const stmt = db.prepare('DELETE FROM courses WHERE id = ?');
    const result = stmt.run(id);

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