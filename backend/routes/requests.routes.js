import express from 'express';
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  approveEdit,
  deleteRequest,
  updateRequestStatus,
  approveRequest,
  acceptTask,
  addUserFeedback,
} from '../controllers/requests.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllRequests);
router.get('/:id', authenticate, getRequestById);
router.post('/', authenticate, createRequest); // Only users can create
router.put('/:id', authenticate, updateRequest);
router.patch('/:id/approve', authenticate, authorize('manager'), approveRequest); // Manager approves
router.patch('/:id/accept', authenticate, acceptTask); // Technician accepts
router.patch('/:id/approve-edit', authenticate, authorize('manager'), approveEdit);
router.patch('/:id/status', authenticate, updateRequestStatus);
router.patch('/:id/feedback', authenticate, addUserFeedback);
router.delete('/:id', authenticate, authorize('manager'), deleteRequest);

export default router;


