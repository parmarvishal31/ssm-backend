import nodemailer from "nodemailer";

const sendEmail = async function (email, message) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Reset Your Password - URL Verification",
    text: `Dear User,\n\nYou have requested to reset your password. Please use the following URL code to proceed with the password reset process:\n\n Url: ${message}\n\nThis URL is valid for the next 5 minutes.\n\nIf you did not request this password reset, you can safely ignore this email.\n\nBest regards,\nYour Application Team`,
    html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <h2 style="color: #0056b3;">Reset Your Password - URL Verification</h2>
                <p>Dear User,</p>
                <p>You have requested to reset your password. Please use the following URL code to proceed with the password reset process:</p>
                <a href="http://localhost:5173${message}" style="font-weight: bold; font-size: 18px; background-color: #e8e8e8; padding: 10px; text-decoration: none; color: #000;">Reset Password</a>
                <p>${message}</p>
                <p style="font-size: 14px;">This URL is valid for the next 5 minutes.</p>
                <p>If you did not request this password reset, you can safely ignore this email.</p>
                <p>Best regards,</p>
                <p>Your Application Team</p>
            </div>
        `,
  };

  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("transpoter error =>", err);
    } else {
      console.log("Email sent:" + info.response);
    }
  });
};
export default sendEmail;
