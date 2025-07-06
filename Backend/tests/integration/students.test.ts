import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import studentRoutes from '../../src/routes/student.routes';
import { studentFactory } from '../helpers/factories';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);

describe('Students API - Comprehensive Tests', () => {
  describe('POST /api/students/create', () => {
    it('should create a new student successfully', async () => {
      const studentData = studentFactory.build();

      const response = await request(app)
        .post('/api/students/create')
        .send(studentData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Student created successfully',
        statusCode: 201,
      });

      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        dateOfBirth: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 400 for invalid student data', async () => {
      const invalidData = {
        firstName: '', 
        lastName: 'Doe',
        email: 'invalid-email', 
        dateOfBirth: '2020-01-01', 
      };

      const response = await request(app)
        .post('/api/students/create')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
      });

      expect(response.body.errors).toHaveProperty('firstName');
      expect(response.body.errors).toHaveProperty('email');
      expect(response.body.errors).toHaveProperty('dateOfBirth');
    });

    it('should return 409 for duplicate email', async () => {
      const studentData = studentFactory.build();

      await request(app)
        .post('/api/students/create')
        .send(studentData)
        .expect(201);

      const response = await request(app)
        .post('/api/students/create')
        .send(studentData)
        .expect(409);

      expect(response.body).toMatchObject({
        success: false,
        message: 'A student with this email already exists',
        statusCode: 409,
      });

      expect(response.body.errors).toHaveProperty('email');
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/students/create')
        .send({})
        .expect(400);

      expect(response.body.errors).toHaveProperty('firstName');
      expect(response.body.errors).toHaveProperty('lastName');
      expect(response.body.errors).toHaveProperty('email');
      expect(response.body.errors).toHaveProperty('dateOfBirth');
    });

    it('should validate minimum age correctly', async () => {
      const tooYoungStudent = studentFactory.build({
        dateOfBirth: new Date().toISOString(),  
      });

      const response = await request(app)
        .post('/api/students/create')
        .send(tooYoungStudent)
        .expect(400);

      expect(response.body.errors.dateOfBirth).toContain('Student must be at least 10 years old');
    });
  });

  describe('GET /api/students/list', () => {
    it('should return empty array when no students exist', async () => {
      const response = await request(app)
        .get('/api/students/list')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Students retrieved successfully',
        data: [],
        statusCode: 200,
      });
    });

    it('should return all students ordered by creation date', async () => {
      const studentsData = studentFactory.buildMultiple(3);

      const createdStudents: any[] = [];
      for (const studentData of studentsData) {
        const response = await request(app)
          .post('/api/students/create')
          .send(studentData);
        createdStudents.push(response.body.data);
      }

      const response = await request(app)
        .get('/api/students/list')
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].createdAt >= response.body.data[1].createdAt).toBe(true);
      expect(response.body.data[1].createdAt >= response.body.data[2].createdAt).toBe(true);
    });
  });

  describe('GET /api/students/list/:id', () => {
    it('should return student by ID', async () => {
      const studentData = studentFactory.build();

      const createResponse = await request(app)
        .post('/api/students/create')
        .send(studentData);

      const studentId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/students/list/${studentId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Student found',
        statusCode: 200,
      });

      expect(response.body.data.id).toBe(studentId);
    });

    it('should return 404 for non-existent student', async () => {
      const fakeId = 'non-existent-id';

      const response = await request(app)
        .get(`/api/students/list/${fakeId}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Student not found',
        data: null,
        statusCode: 404,
      });
    });

    it('should return 400 for empty student ID', async () => {
      const response = await request(app)
        .get('/api/students/list/%20') 
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Invalid student ID',
        statusCode: 400,
      });
    });

    it('should handle malformed UUIDs gracefully', async () => {
      const response = await request(app)
        .get('/api/students/list/invalid-uuid-format')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/students/delete/:id', () => {
    it('should delete student successfully', async () => {
      const studentData = studentFactory.build();

      const createResponse = await request(app)
        .post('/api/students/create')
        .send(studentData);

      const studentId = createResponse.body.data.id;

      await request(app)
        .delete(`/api/students/delete/${studentId}`)
        .expect(204);

      await request(app)
        .get(`/api/students/list/${studentId}`)
        .expect(404);
    });

    it('should return 404 for non-existent student', async () => {
      const fakeId = 'non-existent-id';

      await request(app)
        .delete(`/api/students/delete/${fakeId}`)
        .expect(404);
    });

    it('should return 400 for empty student ID', async () => {
      await request(app)
        .delete('/api/students/delete/%20') 
        .expect(400);
    });

    it('should handle malformed UUIDs in delete', async () => {
      await request(app)
        .delete('/api/students/delete/invalid-uuid')
        .expect(404);
    });
  });

  describe('Input validation edge cases', () => {
    it('should trim whitespace from names', async () => {
      const studentData = studentFactory.build({
        firstName: '  John  ',
        lastName: '  Doe  ',
      });

      const response = await request(app)
        .post('/api/students/create')
        .send(studentData)
        .expect(201);

      expect(response.body.data.firstName).toBe('John');
      expect(response.body.data.lastName).toBe('Doe');
    });

    it('should handle very long names', async () => {
      const longName = 'a'.repeat(100);
      const studentData = studentFactory.build({
        firstName: longName,
        lastName: longName,
      });

      const response = await request(app)
        .post('/api/students/create')
        .send(studentData)
        .expect(201);

      expect(response.body.data.firstName).toBe(longName);
    });

    it('should validate email format variations', async () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'test@',
        'test.example.com',
        'test@.com',
      ];

      for (const email of invalidEmails) {
        const studentData = studentFactory.build({ email });
        
        const response = await request(app)
          .post('/api/students/create')
          .send(studentData)
          .expect(400);

        expect(response.body.errors.email).toBeDefined();
      }
    });

    it('should accept valid date formats', async () => {
      const validDates = [
        '1990-01-01',
        '2000-12-31T23:59:59.999Z',
        '1985-06-15',
      ];

      for (const dateOfBirth of validDates) {
        const studentData = studentFactory.build({ dateOfBirth });
        
        await request(app)
          .post('/api/students/create')
          .send(studentData)
          .expect(201);
      }
    });

    it('should reject invalid date formats', async () => {
      const invalidDates = [
        'invalid-date',
        '32/13/2000',
        '2000-13-01',
        '2000-01-32',
      ];

      for (const dateOfBirth of invalidDates) {
        const studentData = studentFactory.build({ dateOfBirth });
        
        const response = await request(app)
          .post('/api/students/create')
          .send(studentData)
          .expect(400);

        expect(response.body.errors).toBeDefined();
      }
    });
  });
});