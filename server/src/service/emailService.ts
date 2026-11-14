import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT || 587),
  secure: env.SMTP_SECURE === "true",

  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
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