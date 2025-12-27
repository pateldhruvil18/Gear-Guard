import express from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentRequestsCount,
} from '../controllers/equipment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllEquipment);
router.get('/:id', authenticate, getEquipmentById);
router.get('/:id/requests/count', authenticate, getEquipmentRequestsCount);
router.post('/', authenticate, authorize('manager'), createEquipment);
router.put('/:id', authenticate, authorize('manager'), updateEquipment);
router.delete('/:id', authenticate, authorize('manager'), deleteEquipment);

export default router;


