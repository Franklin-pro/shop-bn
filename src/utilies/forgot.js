import nodemailer from 'nodemailer';
import { getUserByEmail, saveResetToken } from '../services/userService'; // Adjust the path as needed

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const { email } = body;

  if (!email) {
    return { error: 'Email is required' };
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return { error: 'User not found' };
  }

  const resetToken = generateResetToken();
  await saveResetToken(user.id, resetToken);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Please use the following link to reset your password: ${resetLink}`
    });

    return { message: 'Reset link sent to your email.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: 'Failed to send reset link. Please try again later.' };
  }
});

function generateResetToken() {
  return require('crypto').randomBytes(32).toString('hex');
}
