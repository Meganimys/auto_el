'use server'
import nodemailer from 'nodemailer';

export async function sendAndSaveMessage(FormData: FormData) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS,
        }
    });

    const name = FormData.get("userName");
    const email = FormData.get("email");
    const category = FormData.get("category");
    const message = FormData.get("problem-description");

    const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'auto.el.sancho@gmail.com', // Куди ви хочете отримувати листи
    subject: `Нове повідомлення від ${name}`,
    categ: category,
    text: `Від: ${email}\n\n${message}`,
    html: `<p><strong>Від:</strong> ${email}</p><p>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Не вдалося надіслати лист' };
  }
}