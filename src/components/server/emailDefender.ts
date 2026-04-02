'use server'

import nodemailer from 'nodemailer';

export async function generateEmailDefenderCode(userEmail: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS,
        }
    });
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: "Ваш код підтвердження для зміни електронної пошти",
        text: `Ваш код підтвердження: ${code}`,
        html: `<p>Ваш код підтвердження: <strong>${code}</strong></p>`,
    };
    await transporter.sendMail(mailOptions);
    return code;
}

export async function checkEmailDefenderCode(inputCode: string, generatedCode: string) {
    return inputCode === generatedCode;
}