import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

function toBoolean(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (typeof value !== "string") return fallback;
    return value.toLowerCase() === "true";
}

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const secure = toBoolean(process.env.SMTP_SECURE, port === 465);
const user = process.env.SMTP_USER;
const passRaw = process.env.SMTP_PASS;
const pass = typeof passRaw === "string" ? passRaw.replace(/\s+/g, "") : passRaw;
const from = process.env.MAIL_FROM || process.env.SMTP_FROM || user;

if (!host || !user || !pass || !from) {
    const err = new Error("SMTP configuration missing. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM.");
    err.status = 500;
    throw err;
}

const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
        user,
        pass,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

export const sendEmail = async ({ to, subject, text, html }) => {
    try {

        const mailOptions = {
            from: process.env.GOOGLE_USER, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        }

        const info = await transporter.sendMail(mailOptions);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};