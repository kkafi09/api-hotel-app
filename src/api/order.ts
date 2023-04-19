import express from 'express';
import orderController from '../controllers/orderController';

const router = express.Router();

router.get('/', orderController.getOrders);

router.get('/:id', orderController.getOrderById);

router.post('/', orderController.createOrder);

router.put('/:id', orderController.updateOrder);

router.put('/c/:id', orderController.updateOrderAdmin);

router.delete('/:id', orderController.deleteOrder);

export default router;
