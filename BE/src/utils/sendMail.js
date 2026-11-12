const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}); 

const sendMail = async (email, subject, html) => {
    await transporter.sendMail({
        from: `"Hệ thống chia sẻ tài liệu" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: html,
    });
};

module.exports =  sendMail ;