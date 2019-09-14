const express = require("express");
const nodemailer = require("nodemailer");
const config = require("../config/mailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: config.mailTrap_user,
    pass: config.mailTrap_pass
  }
});

module.exports = {
  sendEmail(from, subject, to, html) {
    return transporter.sendMail({ from, subject, to, html })

  }
}