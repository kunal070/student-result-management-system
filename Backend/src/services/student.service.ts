import { db, generateId } from '../lib/database';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateStudentInput {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
}

interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  errors?: Record<string, string[]>;
}

const queries = {
  getAllStudents: db.prepare('SELECT * FROM students ORDER BY createdAt DESC'),
  getStudentById: db.prepare('SELECT * FROM students WHERE id = ?'),
  insertStudent: db.prepare(`
    INSERT INTO students (id, firstName, lastName, email, dateOfBirth, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  deleteStudent: db.prepare('DELETE FROM students WHERE id = ?'),
};

export const getAllStudents = async (): Promise<ServiceResponse<Student[]>> => {
  try {
    const students = queries.getAllStudents.all() as Student[];
    return {
      success: true,
      message: 'Students retrieved successfully',
      data: students,
      statusCode: 200,
    };
  } catch (error) {
    console.error('Error fetching students:', error);
    return {
      success: false,
      message: 'Failed to retrieve students',
      data: null,
      statusCode: 500,
    };
  }
};

export const getStudentById = async (id: string): Promise<ServiceResponse<Student>> => {
  try {
    if (!id?.trim()) {
      return {  
        success: false,
        message: 'Invalid student ID',
        data: null,
        statusCode: 400,
      };
    }

    const student = queries.getStudentById.get(id) as Student | undefined;
    
    return {
      success: !!student,
      message: student ? 'Student found' : 'Student not found',
      data: student || null,
      statusCode: student ? 200 : 404,
    };
  } catch (error) {
    console.error('Error fetching student:', error);
    return {
      success: false,
      message: 'Failed to retrieve student',
      data: null,
      statusCode: 500,
    };
  }
};

export const createStudent = async (data: CreateStudentInput): Promise<ServiceResponse<Student>> => {
  try {
    const id = generateId();
    const now = new Date().toISOString();
    const dateOfBirth = new Date(data.dateOfBirth).toISOString(); // Ensure date is in ISO format

    queries.insertStudent.run(
      id,
      data.firstName,
      data.lastName,
      data.email,
      dateOfBirth,
      now,
      now
    );

    const student = queries.getStudentById.get(id) as Student;
    
    return {
      success: true,
      message: 'Student created successfully',
      data: student,
      statusCode: 201,
    };
  } catch (error: any) {
    console.error('Error creating student:', error);
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        success: false,
        message: 'A student with this email already exists',
        data: null,
        statusCode: 409,
        errors: {
          email: ['Email address is already registered'],
        },
      };
    }

    return {
      success: false,
      message: 'Failed to create student',
      data: null,
      statusCode: 500,
    };
  }
};

export const deleteStudent = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    if (!id?.trim()) {
      return {
        success: false,
        message: 'Invalid student ID',
        data: null,
        statusCode: 400,
      };
    }

    const result = queries.deleteStudent.run(id);
    
    return {
      success: result.changes > 0,
      message: result.changes > 0 ? 'Student deleted successfully' : 'Student not found',
      data: null,
      statusCode: result.changes > 0 ? 204 : 404,
    };
  } catch (error) {
    console.error('Error deleting student:', error);
    return {
      success: false,
      message: 'Failed to delete student',
      data: null,
      statusCode: 500,
    };
  }
};