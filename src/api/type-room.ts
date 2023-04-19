import express from 'express';
import multer from 'multer';
import typeRoomController from '../controllers/typeRoomController';

const router = express.Router();
const uploader = multer();

router.get('/', typeRoomController.getTypes);

router.get('/:id', typeRoomController.getTypeById);

router.post('/', uploader.single('foto'), typeRoomController.createType);

router.put('/:id', uploader.single('foto'), typeRoomController.updateType);

router.delete('/:id', typeRoomController.deleteType);

export default router;
