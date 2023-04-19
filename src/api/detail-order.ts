import express from 'express';
import detailOrderController from '../controllers/detailOrderController';

const router = express.Router();

router.get('/', detailOrderController.getDetails);

router.get('/:id', detailOrderController.getDetailById);

router.put('/:id', detailOrderController.updateDetail);

router.delete('/:id', detailOrderController.deleteDetail);

export default router;
