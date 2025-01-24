import express from 'express';
import PaymentController from '../controller/payment.js';

const router = express.Router();

router.post('/', PaymentController.makePayment);
router.get('/', PaymentController.getPayment);
router.get('/:id', PaymentController.getPaymentById);
router.put('/:id', PaymentController.updatePayment);
router.delete('/:id', PaymentController.deletePayment);
router.get('/verify/:token', PaymentController.verifyPayment);


export default router;