import axios from 'axios';
import Payment from '../model/payment.js';
import dotenv from 'dotenv';
import mobileMail from '../utilies/mobileEmail.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

dotenv.config();

const mobileMoneyApiBaseUrl = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';

class PaymentController {
  static async makePayment(req, res) {
    try {
      const { amount, phoneNumber, email, name } = req.body;
      const payment = new Payment({
        amount,
        phoneNumber,
        email,
        name,
      });

      const secret = process.env.SECRET || 'franklin';
    

      const token = jwt.sign({ amount, phoneNumber, email, name }, secret, { expiresIn: '1h' });
      payment.token = token;
      const paymentToken = uuidv4();

      const paymentData = {
        amount: amount,
        currency: 'RWF',
        externalId: paymentToken,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber,
        },
        payerMessage: 'Payment for your order',
        payeeNote: 'Thank you for your payment',
      };

      const headers = {
        'X-Reference-Id': paymentToken,
        'X-Target-Environment': 'sandbox',
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
      };

      const response = await axios.post(`${mobileMoneyApiBaseUrl}`, paymentData, { headers });
      const paymentResponse = response.data;
      const paymentStatus = paymentResponse.status;

      if (paymentStatus === 'SUCCESSFUL') {
        payment.status = 'success';
        await payment.save();
        mobileMail(email, 'Payment Successful', `Dear ${name}, your payment of ${amount} has been successful. Thank you for using our service.`);
        return res.status(201).json({ message: 'Payment successful', payment });
      } else {
        payment.status = 'failed';
        await payment.save();
        mobileMail(email, 'Payment Failed', `Dear ${name}, your payment of ${amount} has failed. Please try again.`);
        return res.status(400).json({ message: 'Payment failed', payment });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getPayment(req, res) {
    try {
      const payments = await Payment.find();
      res.status(200).json({ payments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json({ payment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { amount, phoneNumber, email, name } = req.body;
      const payment = await Payment.findByIdAndUpdate(id, { amount, phoneNumber, email, name }, { new: true });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json({ message: 'Payment updated successfully', payment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async deletePayment(req, res) {
    try {
      const { id } = req.params;
      const payment = await Payment.findByIdAndDelete(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async verifyPayment(req, res) {
    try {
      const { token } = req.params;
      const payment = await Payment.findOne({ token });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      const headers = {
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
      };
      const response = await axios.get(`${mobileMoneyApiBaseUrl}/${payment.token}`, { headers });
      const paymentResponse = response.data;
      const paymentStatus = paymentResponse.status;
      if (paymentStatus === 'SUCCESSFUL') {
        payment.status = 'success';
        await payment.save();
        mobileMail(payment.email, 'Payment Successful', `Dear ${payment.name}, your payment of ${payment.amount} has been successful. Thank you for using our service.`);
        return res.status(200).json({ message: 'Payment successful', payment });
      } else {
        payment.status = 'failed';
        await payment.save();
        mobileMail(payment.email, 'Payment Failed', `Dear ${payment.name}, your payment of ${payment.amount} has failed. Please try again.`);
        return res.status(400).json({ message: 'Payment failed', payment });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;
