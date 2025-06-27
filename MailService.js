const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "iasapp12@gmail.com",
        pass: "rjtpngjztjexgstc",
      },
    });

    const mailOptions = {
      from: "iasapp12@gmail.com",
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = sendMail;
