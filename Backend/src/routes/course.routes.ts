import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
} from '../controllers/course.controller';
import { validateRequest } from '../middleware/validateRequest';
import { idParamSchema } from '../validation/paramSchema';
import { courseSchema } from '../validation/course.validation';

const router = Router();

router.get('/list', getAllCourses);
router.get('/list/:id', validateRequest(idParamSchema, 'params'),getCourseById);
router.post('/create', validateRequest(courseSchema), createCourse);
router.delete('/delete/:id', validateRequest(idParamSchema, 'params'),deleteCourse);

export default router;
