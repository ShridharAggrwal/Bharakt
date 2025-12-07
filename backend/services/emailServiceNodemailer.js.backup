const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // For deployment compatibility
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: `"BloodLink" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your BloodLink account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Welcome to BloodLink!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendSignupTokenEmail = async (email, token, type) => {
  const signupUrl = `${process.env.FRONTEND_URL}/register/${type}/${token}`;
  const typeLabel = type === 'ngo' ? 'NGO' : 'Blood Bank';
  
  const mailOptions = {
    from: `"BloodLink Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `BloodLink - ${typeLabel} Registration Invitation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">BloodLink ${typeLabel} Registration</h2>
        <p>You have been invited to register your ${typeLabel} on BloodLink.</p>
        <p>Click the button below to complete your registration:</p>
        <a href="${signupUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Register Now</a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666;">${signupUrl}</p>
        <p><strong>Important:</strong> This link can only be used once and will expire in 7 days.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">This invitation was sent by a BloodLink administrator.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendBloodRequestAlert = async (email, request) => {
  const mailOptions = {
    from: `"BloodLink Alert" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Urgent: Blood Request for ${request.blood_group}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🩸 Urgent Blood Request</h2>
        <p>Someone nearby needs blood urgently!</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Blood Group:</strong> ${request.blood_group}</p>
          <p><strong>Units Needed:</strong> ${request.units_needed}</p>
          <p><strong>Location:</strong> ${request.address}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View Request</a>
        <hr style="margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">You received this alert because you are within 35km of the request location.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendSignupTokenEmail,
  sendBloodRequestAlert,
};

