import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const mobileMail = async (userInfo)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Replace with your SMTP port
        secure: false, // false for TLS; true for SSL
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      // Example sending an email
      const mailOptions = {
        from:process.env.EMAIL,
        to: userInfo.email,
        subject: 'Payment Successful',
        html: `<p><b>Your payment Successfuly Done!!!!</b> Thank you.🎉🎉🎊</p>`,
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
}
export default mobileMail


