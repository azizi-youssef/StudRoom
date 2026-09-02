import { Router } from 'express';
import { roomController } from '../controllers/room.controller';

const router = Router();

// GET /api/v1/rooms
router.get('/', roomController.getRooms.bind(roomController));

// GET /api/v1/rooms/:id
router.get('/:id', roomController.getRoomById.bind(roomController));

export default router;
