import express from 'express';
import PaymentController from '../controller/payment.js';

const router = express.Router();

router.post('/', PaymentController.makePayment);


export default router;