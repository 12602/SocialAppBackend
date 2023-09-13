const nodemailer = require("nodemailer");

SMPT_SERVICE='gmail';
SMPT_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_MAIL="js223675@gmail.com"
SMTP_PASSWORD="JatinSharma$123"

exports.sendEmail = async (options) => {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "356f9c86767842",
          pass: "04d3d16e1e1b9b"
        }
      });

  const mailOptions = {
    from:SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};