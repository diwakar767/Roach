const nodemailer = require("nodemailer");

const EMAIL_UNAVAILABLE = "Email services aren't available";

const emailConfigured = () => {
    return Boolean(
        process.env.EMAIL_HOST &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS
    );
};

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    if (!emailConfigured()) {
        const error = new Error(EMAIL_UNAVAILABLE);
        error.statusCode = 503;
        throw error;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message
    });
};

const rejectEmailError = (res, error) => {
    if (error && error.statusCode === 503) {
        res.status(503);
        throw new Error(EMAIL_UNAVAILABLE);
    }
    res.status(500);
    throw new Error("Email not sent, please try again");
};

module.exports = sendEmail;
module.exports.emailConfigured = emailConfigured;
module.exports.EMAIL_UNAVAILABLE = EMAIL_UNAVAILABLE;
module.exports.rejectEmailError = rejectEmailError;
