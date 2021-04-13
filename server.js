const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

app.use("/", router);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log("Server running on port: " + port));

const contactEmail = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

contactEmail.verify((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: process.env.EMAIL_USER,
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (err) => {
    if (err) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent!" });
    }
  });
});
