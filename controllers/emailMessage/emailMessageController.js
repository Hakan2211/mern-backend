import sgMail from "@sendgrid/mail";
import EmailMessage from "../../models/emailMessage/EmailMessage.js";
import Filter from "bad-words";
import { StatusCodes } from "http-status-codes";

const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  const emailMessage = subject + "| |" + message;

  // Prevent Profanity
  const filter = new Filter();
  const isProfane = filter.isProfane(emailMessage);
  if (isProfane)
    throw new Error("Email sent failed because it contains profane words.");

  try {
    const msg = {
      to,
      subject,
      text: message,
      from: "hbilgic777@gmail.com",
    };
    await sgMail.send(msg);

    //Save to DB
    await EmailMessage.create({
      sentBy: req.user?._id,
      from: req.user?.email,
      to,
      message,
      subject,
    });

    res.status(StatusCodes.OK).json("Mail sent");
  } catch (error) {
    res.json(error);
  }
};

export { sendEmail };
