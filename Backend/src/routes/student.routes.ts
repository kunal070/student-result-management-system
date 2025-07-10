import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
} from '../controllers/student.controller';
import { validateRequest } from '../middleware/validateRequest';
import { studentSchema } from '../validation/student.validation';
import { idParamSchema } from '../validation/paramSchema';
const router = Router();


router.get('/list', getAllStudents);
router.get('/list/:id', validateRequest(idParamSchema, 'params'),getStudentById);
router.post('/create', validateRequest(studentSchema), createStudent);
router.delete('/delete/:id', validateRequest(idParamSchema, 'params'), deleteStudent);

export default router;
