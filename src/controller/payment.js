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
    const { amount, currency, description, phoneNumber, email } = req.body;

    if (!amount || !currency || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
 
      const decoded = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] });
      console.log('Token decoded:', decoded);
      const referenceId = uuidv4();


      const supportedCurrency = currency.toUpperCase(); 
      const supportedCurrencies = ['USD', 'EUR', 'RWF'];

      if (!supportedCurrencies.includes(supportedCurrency)) {
        return res.status(400).json({ error: 'Currency not supported.' });
      }

      const requestData = {
        amount: amount.toString(),
        currency: supportedCurrency,
        externalId: `momo_${Date.now()}`,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber.toString(),
        },
        payeeNote: description || 'Payment for items',
        payerMessage: description || 'Payment for items',
      };

      console.log('Request Data:', requestData);

      // Make API request
      const mobileMoneyApiResponse = await axios.post(mobileMoneyApiBaseUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${process.env.MTN_ACCESS_TOKEN}`,
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': 'sandbox',
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', mobileMoneyApiResponse.data);

      // Save payment to database
      const payment = new Payment({
        amount,
        currency: supportedCurrency,
        description: description || 'Payment for items',
        phoneNumber,
        email,
        mtnPaymentId: referenceId,
      });

      await payment.save();

      // Send confirmation email
      await mobileMail({ email, subject: 'Payment Confirmation', message: 'Your payment was successful!' });

      res.status(200).json({ message: 'Payment successful', paymentId: referenceId });
    } catch (error) {
      console.error('Error processing payment:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;
