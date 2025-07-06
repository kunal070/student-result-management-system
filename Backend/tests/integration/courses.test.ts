import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import courseRoutes from '../../src/routes/course.routes';
import { courseFactory } from '../helpers/factories';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/courses', courseRoutes);

describe('Courses API - Comprehensive Tests', () => {
  describe('POST /api/courses/create', () => {
    it('should create a new course successfully', async () => {
      const courseData = courseFactory.build();

      const response = await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Course created successfully',
        statusCode: 201,
      });

      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        courseName: courseData.courseName,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 409 for duplicate course name', async () => {
      const courseData = courseFactory.build();

      await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(201);

      const response = await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(409);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Invalid request data',
        statusCode: 409,
      });

      expect(response.body.errors.courseName).toContain(
        'This course name is already registered. Please use a different name.'
      );
    });

    it('should return 400 for empty course name', async () => {
      const response = await request(app)
        .post('/api/courses/create')
        .send({ courseName: '' })
        .expect(400);

      expect(response.body.errors.courseName).toContain('Course name is required');
    });

    it('should return 400 for missing course name', async () => {
      const response = await request(app)
        .post('/api/courses/create')
        .send({})
        .expect(400);

      expect(response.body.errors.courseName).toBeDefined();
    });

    it('should handle very long course names', async () => {
      const longCourseName = 'A'.repeat(200);
      const courseData = { courseName: longCourseName };

      const response = await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(201);

      expect(response.body.data.courseName).toBe(longCourseName);
    });

    it('should trim whitespace from course names', async () => {
      const courseData = { courseName: '  Mathematics  ' };

      const response = await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(201);

      expect(response.body.data.courseName).toBe('Mathematics');
    });

    it('should handle special characters in course names', async () => {
      const specialCourseName = 'C++ Programming & Data Structures (Advanced)';
      const courseData = { courseName: specialCourseName };

      const response = await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(201);

      expect(response.body.data.courseName).toBe(specialCourseName);
    });
  });

  describe('GET /api/courses/list', () => {
    it('should return empty array when no courses exist', async () => {
      const response = await request(app)
        .get('/api/courses/list')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Courses retrieved successfully',
        data: [],
        statusCode: 200,
      });
    });

    it('should return all courses ordered by creation date', async () => {
      const coursesData = courseFactory.buildMultiple(3);

      for (const courseData of coursesData) {
        await request(app)
          .post('/api/courses/create')
          .send(courseData);
      }

      const response = await request(app)
        .get('/api/courses/list')
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.statusCode).toBe(200);
      
      // Verify ordering (newest first)
      const courses = response.body.data;
      for (let i = 0; i < courses.length - 1; i++) {
        expect(new Date(courses[i].createdAt).getTime())
          .toBeGreaterThanOrEqual(new Date(courses[i + 1].createdAt).getTime());
      }
    });

    it('should return courses with all required fields', async () => {
      const courseData = courseFactory.build();
      
      await request(app)
        .post('/api/courses/create')
        .send(courseData);

      const response = await request(app)
        .get('/api/courses/list')
        .expect(200);

      const course = response.body.data[0];
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('courseName');
      expect(course).toHaveProperty('createdAt');
      expect(course).toHaveProperty('updatedAt');
      expect(typeof course.id).toBe('string');
      expect(typeof course.courseName).toBe('string');
    });
  });

  describe('GET /api/courses/list/:id', () => {
    it('should return course by ID', async () => {
      const courseData = courseFactory.build();

      const createResponse = await request(app)
        .post('/api/courses/create')
        .send(courseData);

      const courseId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/courses/list/${courseId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Course found',
        statusCode: 200,
      });

      expect(response.body.data.id).toBe(courseId);
      expect(response.body.data.courseName).toBe(courseData.courseName);
    });

    it('should return 404 for non-existent course', async () => {
      const fakeId = 'non-existent-course-id';

      const response = await request(app)
        .get(`/api/courses/list/${fakeId}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Course not found',
        statusCode: 404,
      });
    });

    it('should handle malformed UUIDs', async () => {
      const response = await request(app)
        .get('/api/courses/list/invalid-uuid-format')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/courses/delete/:id', () => {
    it('should delete course successfully', async () => {
      const courseData = courseFactory.build();

      const createResponse = await request(app)
        .post('/api/courses/create')
        .send(courseData);

      const courseId = createResponse.body.data.id;

      await request(app)
        .delete(`/api/courses/delete/${courseId}`)
        .expect(204);

      await request(app)
        .get(`/api/courses/list/${courseId}`)
        .expect(404);
    });

    it('should return 404 for non-existent course', async () => {
      const fakeId = 'non-existent-course-id';

      await request(app)
        .delete(`/api/courses/delete/${fakeId}`)
        .expect(404);
    });

    it('should handle malformed UUIDs in delete', async () => {
      await request(app)
        .delete('/api/courses/delete/invalid-uuid')
        .expect(404);
    });
  });

  describe('Course name validation edge cases', () => {
    it('should reject null course name', async () => {
      const response = await request(app)
        .post('/api/courses/create')
        .send({ courseName: null })
        .expect(400);

      expect(response.body.errors.courseName).toBeDefined();
    });

    it('should reject whitespace-only course name', async () => {
      const response = await request(app)
        .post('/api/courses/create')
        .send({ courseName: '   ' })
        .expect(400);

      expect(response.body.errors.courseName).toContain('Course name cannot be empty');
    });

    it('should handle unicode characters in course names', async () => {
      const unicodeCourseName = 'Mathématiques Avancées 数学';
      const courseData = { courseName: unicodeCourseName };

      const response = await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(201);

      expect(response.body.data.courseName).toBe(unicodeCourseName);
    });

    it('should handle course names with numbers', async () => {
      const courseData = { courseName: 'CS101 - Introduction to Computer Science' };

      const response = await request(app)
        .post('/api/courses/create')
        .send(courseData)
        .expect(201);

      expect(response.body.data.courseName).toBe(courseData.courseName);
    });
  });

  describe('Concurrent operations', () => {
    it('should handle multiple course creations', async () => {
      const courses = courseFactory.buildMultiple(5);
      
      const promises = courses.map(course => 
        request(app)
          .post('/api/courses/create')
          .send(course)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      const listResponse = await request(app)
        .get('/api/courses/list')
        .expect(200);

      expect(listResponse.body.data).toHaveLength(5);
    });
  });
});