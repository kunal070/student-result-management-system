import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
} from '../controllers/student.controller';
import { validateRequest } from '../middleware/validateRequest';
import { studentSchema } from '../validation/student.validation';
const router = Router();


router.get('/list', getAllStudents);
router.get('/list/:id', getStudentById);
router.post('/create', validateRequest(studentSchema), createStudent);
router.delete('/delete/:id', deleteStudent);

export default router;
