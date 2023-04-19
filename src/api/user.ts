import express from 'express';
import multer from 'multer';
import userController from '../controllers/userController';
import jwtAuth from '../middlewares/jwtAuth';

const router = express.Router();
const uploader = multer();

router.post('/login', userController.login);

router.post('/register', uploader.single('foto'), userController.register);

router.get('/', jwtAuth.verifyToken, userController.getUser);

export default router;
