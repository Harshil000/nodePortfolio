import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
    try {

        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            text,
            html,
        });

        return {
            success: true,
            data: response,
        };

    } catch (error) {
        console.error(error);

        return {
            success: false,
            error,
        };
    }
};