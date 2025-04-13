import { createTransport } from 'nodemailer';
import { config } from '../config/config.js';
import boom from '@hapi/boom';

const {
  mail: { auth, host, port, secure, from },
} = config;

const transporter = createTransport({
  host,
  port: Number(port),
  secure: Boolean(secure),
  auth: {
    user: auth.user,
    pass: auth.pass,
  },
  connectionTimeout: 10000, // 10 segundos de timeout para la conexión
});

const validateEmailInputs = (email, subject, content) => {
  if (!email || !subject || !content) {
    throw boom.badRequest('Missing required email parameters');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw boom.badRequest('Invalid email format');
  }
};

export const sendEmail = async (email, subject, content) => {
  try {
    validateEmailInputs(email, subject, content);

    const info = await transporter.sendMail({
      from: `"Picksy.com" <${from.email}>`,
      to: email,
      subject,
      text: content.text || stripHtml(content.html),
      html: content.html,
    });

    console.log(`Email sent to ${email} [Message ID: ${info.messageId}]`);
    return info;
  } catch (error) {
    console.log(`Email sending failed to ${email}: ${error.message}`);
    throw boom.serverUnavailable('Error sending email', error);
  }
};

export const sendRecoveryEmail = async (email, token) => {
  try {
    const recoveryUrl = `${config.host}/recovery?token=${token}`;

    const emailContent = {
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Restablecer contraseña</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p style="margin: 20px 0;">
            <a href="${recoveryUrl}"
               style="background-color: #2563eb; color: white;
                      padding: 12px 24px; text-decoration: none;
                      border-radius: 4px; display: inline-block;">
              Restablecer contraseña
            </a>
          </p>
          <p style="font-size: 0.9em; color: #666;">
            Si no solicitaste este cambio, puedes ignorar este mensaje.
          </p>
        </div>
      `,
      text: `Restablece tu contraseña: ${recoveryUrl}`,
    };

    return await sendEmail(
      email,
      'Restablecimiento de contraseña - Picksy.com',
      emailContent,
    );
  } catch (error) {
    console.log(
      `Password recovery email failed for ${email}: ${error.message}`,
    );
    throw error;
  }
};

const stripHtml = (html) => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
