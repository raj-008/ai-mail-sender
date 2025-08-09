const CustomError = require("../Utils/CustomError");
const { sendResponse } = require("../Utils/ResponseUtils");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const { VertexAI } = require("@google-cloud/vertexai");
const nodemailer = require("nodemailer");

exports.generateMessage = asyncErrorHandler(async (req, res, next) => {
  const { message } = req.body;

  process.env.GOOGLE_APPLICATION_CREDENTIALS = "./mail-generator.json";

  const vertexAI = new VertexAI({
    project: "mail-generator-468405",
    location: "us-central1",
  });

  const prompt = `Act as an email content writer.
                  Write the email for the following details: ${message}.
                  You must return only valid JSON with two keys: "subject" and "message".
                  Do NOT add any markdown, any HTML Tags, any code blocks, any triple quotes, or any extra text - only the JSON object.
                `;

  const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const contents = [{ role: "user", parts: [{ text: prompt }] }];

  const result = await model.generateContent({
    contents: contents,
  });

  let data = result.response.candidates[0].content.parts[0].text;
  data = data.replace(/```json|```/g, "").trim();
  data = JSON.parse(data);

  return sendResponse(res, "Data recived successfully", data);
});

exports.sendEmails = asyncErrorHandler(async (req, res, next) => {
  const input = req.body;

  const emails = input.emails;
  if (!emails.length) throw new CustomError("No emails found", 404);

  const subject = input.subject;
  const message = input.message;

  emails.forEach((email) => {
    sendEmail(email, message, subject);
  });

  return sendResponse(res, "Emails Send successfully", input);
});

const sendEmail = async (receiver, _message, _subject) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.MAIL_FROM,
    to: receiver,
    subject: _subject,
    text: _message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error occurred:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
