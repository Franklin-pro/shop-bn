import axios from 'axios';
import Payment from '../model/payment.js';
import dotenv from 'dotenv';
import mobileMail from '../utilies/mobileEmail.js';

dotenv.config();

const mobileMoneyApiBaseUrl = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay'; // Correct sandbox URL
const sellerPhoneNumber = process.env.SELLER_PHONE_NUMBER;
class PaymentController {
  static async makePayment(req, res) {
    const { amount, currency, description, phoneNumber, email, items } = req.body;

    console.log('Request Body:', req.body);

    if (!amount || !phoneNumber || !email || !items) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const requestData = {
        amount,
        currency: 'RWF',
        externalId: `momo_${Date.now()}`, // Unique ID for the transaction
        payer: {
          partyIdType: 'MSISDN',
          partyId: sellerPhoneNumber,
        },
        payeeNote: description,
        payerMessage: description,
      };

      console.log('Request Data:', requestData);

      const mobileMoneyApiResponse = await axios.post(mobileMoneyApiBaseUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${process.env.MTN_API_KEY}`, 
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY, // Add subscription key
          'X-Reference-Id': requestData.externalId,
          'X-Target-Environment': 'sandbox',
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', mobileMoneyApiResponse.data);

      const payment = new Payment({
        amount,
        currency,
        description,
        phoneNumber,
        email,
        mtnPaymentId: mobileMoneyApiResponse.data.paymentId,
      });

      await payment.save();

      await mobileMail({ email, subject: 'Payment Confirmation', message: 'Your payment was successful!' });

      res.status(200).json({ message: 'Payment successful', paymentId: mobileMoneyApiResponse.data.paymentId });
    } catch (error) {
      console.error('Error processing payment:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;