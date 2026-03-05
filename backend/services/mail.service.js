import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

export const sendMail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: ENV.MAIL_HOST,
    port: ENV.MAIL_PORT,
    secure: false,
    auth: {
      user: ENV.MAIL_USER,
      pass: ENV.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: ENV.MAIL_USER,
    to,
    subject,
    text,
  });
};