const express = require("express");
const router = express.Router();
const MailController = require("../Controller/MailController");

router.get("/test-backend", (req, res) => {
    res.send("Hii, Welcome to AI Mail Generator Backend");
});

router.post("/generate-message", MailController.generateMessage);
router.post("/send-emails", MailController.sendEmails);

module.exports = router;