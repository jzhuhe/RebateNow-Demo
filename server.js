const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        
        // Create a test account using Ethereal
        const testAccount = await nodemailer.createTestAccount();
        
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        
        // Send the email
        const info = await transporter.sendMail({
            from: '"PhysioPlus" <info@physioplus.com.au>',
            to: to,
            subject: subject,
            html: body
        });
        
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            previewUrl: nodemailer.getTestMessageUrl(info)
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 