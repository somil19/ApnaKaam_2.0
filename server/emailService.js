import schedule from "node-schedule";
import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_APP_PASS,
  },
});

const sendEmail = (toEmail, subject, body, sendTime) => {
  const job = schedule.scheduleJob(new Date(sendTime), async () => {
    try {
      
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: toEmail, 
        subject: subject,
        text: body,
      };

      
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  });

  return job;
};
export default sendEmail;
