import express from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
} from '../controllers/teams.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllTeams);
router.get('/:id', authenticate, getTeamById);
router.post('/', authenticate, authorize('manager'), createTeam);
router.put('/:id', authenticate, authorize('manager'), updateTeam);
router.delete('/:id', authenticate, authorize('manager'), deleteTeam);
router.post('/:id/members', authenticate, authorize('manager'), addMember);
router.delete('/:id/members/:userId', authenticate, authorize('manager'), removeMember);

export default router;


