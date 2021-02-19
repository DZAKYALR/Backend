const nodemailer = require("nodemailer");
const adminPassword = process.env.GOOGLE_PASS;
const adminEmail = process.env.GOOGLE_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: adminEmail,
    pass: adminPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function sendEmail(email) {
  const mailOptions = {
    from: adminEmail,
    to: email,
    subject: "Flip Card",
    text: `Hi ${email}, thank you for using our service :)`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
}

module.exports = {
  sendEmail,
};
