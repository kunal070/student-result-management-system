import { Router } from 'express';
import {
  createResult,
  deleteResult,
  getAllResults,
} from '../controllers/result.controller';
import { validateRequest } from '../middleware/validateRequest';
import { resultSchema } from '../validation/result.validation';
import { idParamSchema } from '../validation/paramSchema';


const router = Router();

router.get('/list', getAllResults);
router.post('/create', validateRequest(resultSchema), createResult);
router.delete('/delete/:id', validateRequest(idParamSchema, 'params'),deleteResult);

export default router;
