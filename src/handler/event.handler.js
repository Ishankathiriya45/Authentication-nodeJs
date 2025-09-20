const { MailService } = require("../service");
const { EventEmitter } = require("events");
const myEmitter = new EventEmitter();
const emailService = new MailService();

myEmitter.on("send-mail", async (data) => {
  await emailService.sendMail(data.email, data.subject, data.body);
});

module.exports = myEmitter;
