import axios from 'axios';
import Payment from '../model/payment.js';
import dotenv from 'dotenv';
import mobileMail from '../utilies/mobileEmail.js';

dotenv.config();

const mobileMoneyApiBaseUrl = 'https://momoapi.mtn.co.rw'; // Ensure this is correct

class PaymentController {
  static async makePayment(req, res) {
    const { amount, currency, description, phoneNumber, email, items } = req.body;

    console.log('Request Body:', req.body);

    if (!amount || !phoneNumber || !email || !items) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const mobileMoneyApiResponse = await axios.post(`${mobileMoneyApiBaseUrl}`, {
        amount,
        currency: 'RWF',
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber.toString(),
        },
        payee: {
          partyIdType: 'MSISDN',
          partyId: '0790019543', // Replace with the recipient's phone number where money should be received
        },
        payeeNote: description,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MTN_API_KEY}`, 
          'Content-Type': 'application/json',
        },
      });

      const payment = new Payment({
        amount,
        currency,
        description,
        phoneNumber,
        email,
        mtnPaymentId: mobileMoneyApiResponse.data.paymentId,
      });

      await payment.save();

      await mobileMail({ email });

      res.status(200).json({ message: 'Payment successful', paymentId: mobileMoneyApiResponse.data.paymentId });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;
