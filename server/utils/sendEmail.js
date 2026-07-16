// Import Nodemailer
const nodemailer = require("nodemailer");

// Function to send emails
const sendEmail = async (to, subject, text) => {

    try {

        // Create transporter using Gmail
        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {

                user: process.env.EMAIL_USER,

                pass: process.env.EMAIL_PASS

            }

        });

        // Email details
        const mailOptions = {

            from: process.env.EMAIL_USER,

            to,

            subject,

            text

        };

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log("✅ Email Sent Successfully");

    }

    catch (error) {

        console.error("❌ Email Sending Failed");

        console.error(error.message);

    }

};

// Export function
module.exports = sendEmail;