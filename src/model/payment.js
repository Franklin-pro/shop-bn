import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
   
  },
  description: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  mtnPaymentId: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending' // You might want to track the status of the payment
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
