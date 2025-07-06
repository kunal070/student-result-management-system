import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
} from '../controllers/course.controller';
import { validateRequest } from '../middleware/validateRequest';
import { courseSchema } from '../validation/course.validation';

const router = Router();

router.get('/list', getAllCourses);
router.get('/list/:id', getCourseById);
router.post('/create', validateRequest(courseSchema), createCourse);
router.delete('/delete/:id', deleteCourse);

export default router;
