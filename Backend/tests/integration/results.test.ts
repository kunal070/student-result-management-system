import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import studentRoutes from '../../src/routes/student.routes';
import courseRoutes from '../../src/routes/course.routes';
import resultRoutes from '../../src/routes/result.routes';
import { studentFactory, courseFactory, resultFactory } from '../helpers/factories';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/results', resultRoutes);

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  errors?: Record<string, string[]>;
}

interface Result {
  id: string;
  studentId: string;
  courseId: string;
  grade: string;
  createdAt: string;
  updatedAt: string;
  student?: any;
  course?: any;
}

describe('Results API - Comprehensive Tests', () => {
  let studentId: string;
  let courseId: string;
  let secondStudentId: string;
  let secondCourseId: string;

  beforeEach(async () => {
    const studentResponse = await request(app)
      .post('/api/students/create')
      .send(studentFactory.build());
    studentId = (studentResponse.body as ApiResponse<any>).data.id;

    const secondStudentResponse = await request(app)
      .post('/api/students/create')
      .send(studentFactory.build());
    secondStudentId = (secondStudentResponse.body as ApiResponse<any>).data.id;

    const courseResponse = await request(app)
      .post('/api/courses/create')
      .send(courseFactory.build());
    courseId = (courseResponse.body as ApiResponse<any>).data.id;

    const secondCourseResponse = await request(app)
      .post('/api/courses/create')
      .send(courseFactory.build());
    secondCourseId = (secondCourseResponse.body as ApiResponse<any>).data.id;
  });

  describe('POST /api/results/create', () => {
    it('should create a new result successfully', async () => {
      const resultData = resultFactory.build(studentId, courseId);

      const response = await request(app)
        .post('/api/results/create')
        .send(resultData)
        .expect(201);

      const body = response.body as ApiResponse<Result>;

      expect(body).toMatchObject({
        success: true,
        message: 'Result created successfully',
        statusCode: 201,
      });

      expect(body.data).toMatchObject({
        id: expect.any(String),
        studentId: resultData.studentId,
        courseId: resultData.courseId,
        grade: resultData.grade,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should update existing result (upsert behavior)', async () => {
      const resultData = resultFactory.build(studentId, courseId, { grade: 'A' });

      await request(app).post('/api/results/create').send(resultData).expect(201);

      const updateData = { ...resultData, grade: 'B' };
      const response = await request(app)
        .post('/api/results/create')
        .send(updateData)
        .expect(200);

      const body = response.body as ApiResponse<Result>;

      expect(body.message).toBe('Result updated successfully');
      expect(body.data.grade).toBe('B');
    });

    it('should return 400 for invalid student ID format', async () => {
      const invalidData = resultFactory.build('invalid-id', courseId);

      const response = await request(app)
        .post('/api/results/create')
        .send(invalidData)
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.message).toBe('Validation failed');
      expect(body.errors?.studentId).toContain('Invalid student ID');
    });

    it('should return 400 for invalid course ID format', async () => {
      const invalidData = resultFactory.build(studentId, 'invalid-id');

      const response = await request(app)
        .post('/api/results/create')
        .send(invalidData)
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.errors?.courseId).toContain('Invalid course ID');
    });

    it('should return 400 for invalid grade', async () => {
      const response = await request(app)
        .post('/api/results/create')
        .send({ studentId, courseId, grade: 'X' })
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.errors?.grade).toBeDefined();
    });

    it('should test all valid grades', async () => {
      const validGrades = ['A', 'B', 'C', 'D', 'E', 'F'];

      for (const grade of validGrades) {
        const studentResp = await request(app)
          .post('/api/students/create')
          .send(studentFactory.build());
        const testStudentId = (studentResp.body as ApiResponse<any>).data.id;

        const resultData = resultFactory.build(testStudentId, courseId, { grade });
        const response = await request(app)
          .post('/api/results/create')
          .send(resultData)
          .expect(201);

        const body = response.body as ApiResponse<Result>;
        expect(body.data.grade).toBe(grade);
      }
    });

    it('should return 400 for non-existent student ID', async () => {
      const fakeStudentId = '12345678-1234-1234-1234-123456789012';
      const resultData = resultFactory.build(fakeStudentId, courseId);

      const response = await request(app)
        .post('/api/results/create')
        .send(resultData)
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.message).toBe('Invalid student or course ID');
    });

    it('should return 400 for non-existent course ID', async () => {
      const fakeCourseId = '12345678-1234-1234-1234-123456789012';
      const resultData = resultFactory.build(studentId, fakeCourseId);

      const response = await request(app)
        .post('/api/results/create')
        .send(resultData)
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.message).toBe('Invalid student or course ID');
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/results/create')
        .send({})
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.errors).toHaveProperty('studentId');
      expect(body.errors).toHaveProperty('courseId');
      expect(body.errors).toHaveProperty('grade');
    });

    it('should handle multiple results for same student in different courses', async () => {
      const result1 = resultFactory.build(studentId, courseId, { grade: 'A' });
      await request(app).post('/api/results/create').send(result1).expect(201);

      const result2 = resultFactory.build(studentId, secondCourseId, { grade: 'B' });
      const response = await request(app).post('/api/results/create').send(result2).expect(201);

      const body = response.body as ApiResponse<Result>;
      expect(body.data.grade).toBe('B');
    });

    it('should handle multiple results for different students in same course', async () => {
      const result1 = resultFactory.build(studentId, courseId, { grade: 'A' });
      await request(app).post('/api/results/create').send(result1).expect(201);

      const result2 = resultFactory.build(secondStudentId, courseId, { grade: 'B' });
      const response = await request(app).post('/api/results/create').send(result2).expect(201);

      const body = response.body as ApiResponse<Result>;
      expect(body.data.grade).toBe('B');
    });
  });

  describe('GET /api/results/list', () => {
    it('should return empty array when no results exist', async () => {
      const response = await request(app).get('/api/results/list').expect(200);
      const body = response.body as ApiResponse<Result[]>;
      expect(body.data).toEqual([]);
    });

    it('should return all results with student and course information', async () => {
      const resultData = resultFactory.build(studentId, courseId);
      await request(app).post('/api/results/create').send(resultData);

      const response = await request(app).get('/api/results/list').expect(200);
      const body = response.body as ApiResponse<Result[]>;

      expect(body.data[0]).toHaveProperty('student');
      expect(body.data[0]).toHaveProperty('course');
    });

    it('should return results ordered by creation date (newest first)', async () => {
      const result1 = resultFactory.build(studentId, courseId);
      const result2 = resultFactory.build(secondStudentId, courseId);
      const result3 = resultFactory.build(studentId, secondCourseId);

      await request(app).post('/api/results/create').send(result1);
      await request(app).post('/api/results/create').send(result2);
      await request(app).post('/api/results/create').send(result3);

      const response = await request(app).get('/api/results/list').expect(200);
      const body = response.body as ApiResponse<Result[]>;

      for (let i = 0; i < body.data.length - 1; i++) {
        expect(new Date(body.data[i].createdAt).getTime()).toBeGreaterThanOrEqual(
          new Date(body.data[i + 1].createdAt).getTime()
        );
      }
    });
  });

  describe('DELETE /api/results/delete/:id', () => {
    it('should delete result successfully', async () => {
      const resultData = resultFactory.build(studentId, courseId);
      const createResponse = await request(app)
        .post('/api/results/create')
        .send(resultData);

      const createBody = createResponse.body as ApiResponse<Result>;
      const resultId = createBody.data.id;

      await request(app)
        .delete(`/api/results/delete/${resultId}`)
        .expect(204);

      const listResponse = await request(app)
        .get('/api/results/list')
        .expect(200);

      const listBody = listResponse.body as ApiResponse<Result[]>;
      expect(listBody.data).toHaveLength(0);
    });

    it('should return 404 for non-existent result', async () => {
      const fakeId = '12345678-1234-1234-1234-123456789012';

      await request(app)
        .delete(`/api/results/delete/${fakeId}`)
        .expect(404);
    });

    it('should handle malformed UUIDs in delete', async () => {
      await request(app)
        .delete('/api/results/delete/invalid-uuid')
        .expect(404);
    });

    it('should not affect other results when deleting one', async () => {
      const result1 = resultFactory.build(studentId, courseId);
      const result2 = resultFactory.build(secondStudentId, courseId);

      const response1 = await request(app)
        .post('/api/results/create')
        .send(result1);

      await request(app)
        .post('/api/results/create')
        .send(result2);

      const body1 = response1.body as ApiResponse<Result>;
      const resultId = body1.data.id;

      await request(app)
        .delete(`/api/results/delete/${resultId}`)
        .expect(204);

      const listResponse = await request(app)
        .get('/api/results/list')
        .expect(200);

      const listBody = listResponse.body as ApiResponse<Result[]>;
      expect(listBody.data).toHaveLength(1);
      expect(listBody.data[0].studentId).toBe(secondStudentId);
    });
  });

  describe('Grade validation edge cases', () => {
    it('should reject lowercase grades', async () => {
      const resultData = { studentId, courseId, grade: 'a' };

      const response = await request(app)
        .post('/api/results/create')
        .send(resultData)
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.errors?.grade).toBeDefined();
    });

    it('should reject numeric grades', async () => {
      const resultData = { studentId, courseId, grade: '85' };

      const response = await request(app)
        .post('/api/results/create')
        .send(resultData)
        .expect(400);

      const body = response.body as ApiResponse<null>;
      expect(body.errors?.grade).toBeDefined();
    });

    it('should reject plus/minus grades', async () => {
      const invalidGrades = ['A+', 'B-', 'C+'];

      for (const grade of invalidGrades) {
        const resultData = { studentId, courseId, grade };

        const response = await request(app)
          .post('/api/results/create')
          .send(resultData)
          .expect(400);

        const body = response.body as ApiResponse<null>;
        expect(body.errors?.grade).toBeDefined();
      }
    });
  });

  describe('Cascade deletion behavior', () => {
    it('should delete results when student is deleted', async () => {
      const resultData = resultFactory.build(studentId, courseId);
      await request(app)
        .post('/api/results/create')
        .send(resultData);

      const before = await request(app)
        .get('/api/results/list')
        .expect(200);

      const beforeBody = before.body as ApiResponse<Result[]>;
      expect(beforeBody.data.length).toBeGreaterThan(0);

      await request(app)
        .delete(`/api/students/delete/${studentId}`)
        .expect(204);

      const after = await request(app)
        .get('/api/results/list')
        .expect(200);

      const afterBody = after.body as ApiResponse<Result[]>;
      expect(afterBody.data).toHaveLength(0);
    });

    it('should delete results when course is deleted', async () => {
      const resultData = resultFactory.build(studentId, courseId);
      await request(app)
        .post('/api/results/create')
        .send(resultData);

      const before = await request(app)
        .get('/api/results/list')
        .expect(200);

      const beforeBody = before.body as ApiResponse<Result[]>;
      expect(beforeBody.data.length).toBeGreaterThan(0);

      await request(app)
        .delete(`/api/courses/delete/${courseId}`)
        .expect(204);

      const after = await request(app)
        .get('/api/results/list')
        .expect(200);

      const afterBody = after.body as ApiResponse<Result[]>;
      expect(afterBody.data).toHaveLength(0);
    });
  });

  describe('Data integrity tests', () => {
    it('should maintain referential integrity', async () => {
      const resultData = resultFactory.build(studentId, courseId);
      const response = await request(app)
        .post('/api/results/create')
        .send(resultData);

      const body = response.body as ApiResponse<Result>;

      expect(body.data.studentId).toBe(studentId);
      expect(body.data.courseId).toBe(courseId);

      await request(app)
        .get(`/api/students/list/${studentId}`)
        .expect(200);

      await request(app)
        .get(`/api/courses/list/${courseId}`)
        .expect(200);
    });

    it('should handle simultaneous result creation', async () => {
      const promises: Promise<request.Response>[] = [];

      for (let i = 0; i < 3; i++) {
        const studentResp = await request(app)
          .post('/api/students/create')
          .send(studentFactory.build());
        const testStudentId = (studentResp.body as ApiResponse<any>).data.id;

        const resultData = resultFactory.build(testStudentId, courseId);
        promises.push(
          request(app).post('/api/results/create').send(resultData)
        );
      }

      const responses = await Promise.all(promises);
      for (const res of responses) {
        const body = res.body as ApiResponse<Result>;
        expect(res.status).toBe(201);
        expect(body.success).toBe(true);
      }
    });
  });
});



