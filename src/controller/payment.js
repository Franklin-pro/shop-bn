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
    const { amount, currency, description, phoneNumber, email, items } = req.body;

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6ImM0ZjZkMzNkLWVhNzYtNDYwOS1iODE2LWE5OWRjODAxYjUzMiIsImV4cGlyZXMiOiIyMDIwLTA2LTA5VDIwOjMyOjQyLjIwMSIsInNlc3Npb25JZCI6IjZkYjg0MjIxLWM4ZWQtNGZhZC1hMDM5LWYzZDY3YzNjMzMwMiJ9.FUhqzW_HhXlOIsYu3YQMWsfpBujSktAldnnh70De8uKuuPGGlgIEmIrakQ91klV8rNeD2g_tq9nOR748j8O-vp5oNKDmmt5ANo2qUoYZTaiwSthev6DQ2TLvxr45w4QCX0YmPTDtkue_9R7ZpnEhud51XlKfEOEMAZhdWoVDvL08xrwrL-yP2yfLGRZVtZfpaqrx7CxgUO3MT_zXy8QuvHAvlwlgxIvkZhILdTbycyZHAtvRCeoMJ0G7REsQQYHfNNm87aXg9vwcjDu-YZGVaA27jHP2z-l4gbeg-sluoqafcQ8YwqPZ4nGcAMoMCTU6wtUICDMNw-qWpZwlHEixaw';
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console
      // Proceed with payment processing
      const referenceId = uuidv4();

      const requestData = {
        amount: amount.toString(),
        currency: currency.toUpperCase(),
        externalId: `momo_${Date.now()}`,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber, // Ensure phoneNumber is correct
        },
        payeeNote: description || 'Payment for items',
        payerMessage: description || 'Payment for items',
      };
console.log('request data:',requestData)
      const mobileMoneyApiResponse = await axios.post(mobileMoneyApiBaseUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${process.env.MTN_ACCESS_TOKEN}`,
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': 'sandbox',
          'Content-Type': 'application/json',
        },
      });
console.log(mobileMoneyApiResponse)
      const payment = new Payment({
        amount,
        currency: currency.toUpperCase(),
        description: description || 'Payment for items',
        phoneNumber,
        email,
        mtnPaymentId: referenceId,
      });
console.log(payment)
      await payment.save();
      await mobileMail({ email, subject: 'Payment Confirmation', message: 'Your payment was successful!' });

      res.status(200).json({ message: 'Payment successful', paymentId: referenceId });
    } catch (error) {
      console.error('Error processing payment:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;
