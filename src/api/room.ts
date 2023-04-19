import express from 'express';
import roomController from '../controllers/roomController';

const router = express.Router();

router.get('/', roomController.getRooms);

router.get('/:id', roomController.getRoomById);

router.post('/', roomController.createRoom);

router.put('/:id', roomController.updateRoom);

router.delete('/:id', roomController.deleteRoom);

export default router;
