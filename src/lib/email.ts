import nodemailer from "nodemailer";

type Transporter = nodemailer.Transporter | null;

let cachedTransporter: Transporter = null;
let cachedTestAccount: nodemailer.TestAccount | null = null;

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.SMTP_HOST) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
    return cachedTransporter;
  }

  cachedTestAccount = await nodemailer.createTestAccount();
  cachedTransporter = nodemailer.createTransport({
    host: cachedTestAccount.smtp.host,
    port: cachedTestAccount.smtp.port,
    secure: cachedTestAccount.smtp.secure,
    auth: {
      user: cachedTestAccount.user,
      pass: cachedTestAccount.pass,
    },
  });

  return cachedTransporter;
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const transporter = await getTransporter();
  const from = process.env.EMAIL_FROM ?? "no-reply@toolcompany.test";

  const info = await transporter.sendMail({
    from,
    to,
    subject: "Passwort für ToolCompany zurücksetzen",
    text: `Wir haben eine Anfrage zum Zurücksetzen deines Passworts erhalten.\n\nNutze diesen Link, um ein neues Passwort zu setzen: ${resetLink}\n\nWenn die Anfrage nicht von dir stammt, kannst du diese E-Mail ignorieren.`,
    html: `<p>Wir haben eine Anfrage zum Zurücksetzen deines Passworts erhalten.</p>
<p><a href="${resetLink}">Hier klicken, um ein neues Passwort zu setzen</a></p>
<p>Wenn die Anfrage nicht von dir stammt, kannst du diese E-Mail ignorieren.</p>`,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.info(`[email] Vorschau Passwort-Reset: ${previewUrl}`);
  }
}
