import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  email: string;
  subject: string;
  emailVerificationMessage: string;
}

export const sendEmail = async ({
  email,
  subject,
  emailVerificationMessage,
}: EmailOptions) => {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject,
    html: emailVerificationMessage,
  });
};