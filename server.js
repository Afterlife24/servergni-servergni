// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const { MongoClient } = require('mongodb');

// const app = express();
// const savedOTPS = {};

// // CORS configuration
// const corsOptions = {
//     origin: (origin, callback) => {
//         const allowedOrigins = [
//             'https://demo-gni.gofastapi.com',
//             'https://yourfrontenddomain.com',
//             'http://localhost:5173',
//             'http://localhost:3000'
//         ];
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // MongoDB connection
// const uri = "mongodb+srv://Dhanush2002:Dhanush2002@cluster0.ool5p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// let db;

// async function connectToMongo() {
//     try {
//         const client = new MongoClient(uri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 5000,
//         });
//         await client.connect();
//         db = client.db('Dhanush2002');
//         console.log('✅ Connected to MongoDB');

//         // const PORT = 5000;
//         // app.listen(PORT, () => {
//         //     console.log(`🚀 Server running on http://localhost:${PORT}`);
//         // });
//     } catch (err) {
//         console.error('❌ Error connecting to MongoDB:', err);
//         setTimeout(connectToMongo, 3000);
//     }
// }
// connectToMongo();

// // ✅ Check if email already exists
// app.post('/check-email', async (req, res) => {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ error: 'Email is required.' });

//     try {
//         const collection = db.collection('packageSubmissions');
//         const existingUser = await collection.findOne({ email });
//         return res.status(200).json({
//             exists: !!existingUser,
//             message: existingUser ? 'Email already subscribed.' : 'Email not found.'
//         });
//     } catch (error) {
//         console.error('❌ Error checking email:', error);
//         return res.status(500).json({ error: 'Failed to check email.' });
//     }
// });

// // ✅ Contact form submission
// app.post('/contact', async (req, res) => {
//     const { name, email, message } = req.body;
//     if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required.' });

//     try {
//         if (!db) return res.status(503).json({ error: 'Database not connected.' });
//         const collection = db.collection('contact_details');
//         const result = await collection.insertOne({ name, email, message, createdAt: new Date() });
//         console.log('✅ Contact saved:', result.insertedId);
//         res.status(200).json({ success: true });
//     } catch (error) {
//         console.error('❌ Error inserting contact:', error);
//         res.status(500).json({ error: 'Failed to submit contact form.' });
//     }
// });

// // ✅ Get all contact submissions
// app.get('/contact', async (req, res) => {
//     try {
//         if (!db) return res.status(503).json({ error: 'Database not connected' });
//         const entries = await db.collection('contact_details').find().sort({ createdAt: -1 }).toArray();
//         res.status(200).json(entries);
//     } catch (error) {
//         console.error('❌ Error fetching contacts:', error);
//         res.status(500).json({ error: 'Server error while fetching contacts' });
//     }
// });

// // ✅ Package details + confirmation email
// app.post('/details', async (req, res) => {
//     const { email, package: packageType } = req.body;
//     if (!email || !packageType) return res.status(400).json({ error: 'Email and package type are required.' });

//     try {
//         const transporter = nodemailer.createTransport({
//             host: "smtpout.secureserver.net",
//             port: 465,
//             secure: true,
//             auth: {
//                 user: "contact@gniapp.com",
//                 pass: "@Riosrogers99."
//             }
//         });
// const mailOptions = {
//     from: 'GNI <contact@gniapp.com>',
//     to: email,
//     subject: `Confirmation: ${packageType} Package Selected`,
//     html: `
// <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
//   <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
//     <h2 style="color: #1e3a8a; margin: 0;">Package Selection Confirmation</h2>
//   </div>
  
//   <div style="padding: 20px; background-color: #ffffff; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
//     <p>Dear Customer,</p>
    
//     <p>Thank you for selecting our <strong style="color: #1e40af;">${packageType}</strong> package. We appreciate your interest in our services.</p>
    
//     <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 15px 0;">
//       <h3 style="color: #1e3a8a; margin-top: 0;">Package Details</h3>
//       <p style="margin: 5px 0;"><span style="color: #64748b;">• Selected Package:</span> <strong>${packageType}</strong></p>
//       <p style="margin: 5px 0;"><span style="color: #64748b;">• Selection Date:</span> ${new Date().toDateString()}</p>
//     </div>
//   </div>
  
//   <div style="padding: 20px; background-color: #f9fafb; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
//     <h3 style="color: #1e3a8a; margin-top: 0;">Next Steps</h3>
//     <p>Our team will review your selection and contact you if any additional information is required.</p>
//   </div>
  
//   <div style="padding: 20px; background-color: #eff6ff; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
//     <h3 style="color: #1e3a8a; margin-top: 0;">Support Information</h3>
//     <p>If you have any questions or need to modify your selection, please reply to this email or contact us at <span style="color: #2563eb;">contact@gniapp.com</span>.</p>
    
//     <p style="margin-top: 20px;">We look forward to serving you.</p>
    
//     <p style="color: #1e3a8a; font-weight: bold;">Best regards,</p>
//     <p style="font-weight: bold; margin-bottom: 0;">The GNI App Team</p>
//   </div>
  
//   <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
//     <p>GNI App • Simple, Effective Solutions</p>
//   </div>
// </div>
//     `,
//     text: `[Keep the same plain text version from previous example as fallback]`
// };

//         await transporter.sendMail(mailOptions);

//         const collection = db.collection('packageSubmissions');
//         const newEntry = { email, packageType, createdAt: new Date() };
//         await collection.insertOne(newEntry);

//         console.log('✅ Confirmation sent & details saved:', newEntry);
//         res.status(200).json({ message: 'Email sent and details saved.', data: newEntry });
//     } catch (error) {
//         console.error('❌ Error processing details:', error);
//         res.status(500).json({ error: 'Failed to process your request.' });
//     }
// });

// // ✅ Get all package submissions
// app.get('/details', async (req, res) => {
//     try {
//         const entries = await db.collection('packageSubmissions').find().sort({ createdAt: -1 }).toArray();
//         res.status(200).json(entries);
//     } catch (error) {
//         console.error('❌ Error in GET /details:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // ✅ Send OTP via email
// app.post('/sendotp', (req, res) => {
//     const email = req.body.email;
//     const otp = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');

//     const transporter = nodemailer.createTransport({
//         host: "smtpout.secureserver.net",
//         port: 465,
//         secure: true,
//         auth: {
//             user: "contact@gniapp.com",
//             pass: "@Riosrogers99."
//         }
//     });

//     const mailOptions = {
//     from: 'GNI <contact@gniapp.com>',
//     to: email,
//     subject: "GNI App Verification Code",
//     html: `
// <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
//   <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
//     <h2 style="color: #1e3a8a; margin: 0;">Email Verification</h2>
//   </div>
  
//   <div style="padding: 20px; background-color: #ffffff; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
//     <p>Dear User,</p>
    
//     <p>Please use the following verification code to complete your authentication:</p>
    
//     <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center;">
//       <h3 style="color: #1e3a8a; margin-top: 0; margin-bottom: 10px;">Your Verification Code</h3>
//       <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1e40af; margin: 15px 0;">${otp}</div>
//       <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">This code will expire in 10 minutes</p>
//     </div>
    
//     <p>For security reasons, please do not share this code with anyone.</p>
//   </div>
  
//   <div style="padding: 20px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
//     <h3 style="color: #1e3a8a; margin-top: 0;">Need Help?</h3>
//     <p>If you didn't request this code, please ignore this email or contact support at <span style="color: #2563eb;">contact@gniapp.com</span>.</p>
//   </div>
  
//   <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
//     <p>GNI App • Secure Authentication</p>
//   </div>
// </div>
//     `,
//     text: `
// GNI App - Email Verification

// Dear User,

// Your verification code is: ${otp}

// This code will expire in 60 seconds.

// For security reasons, please do not share this code with anyone.

// If you didn't request this code, please ignore this email or contact support at contact@gniapp.com.

// --
// GNI App
// Secure Authentication
// `.trim()
// };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error(`❌ Error sending OTP: ${error}`);
//             return res.status(500).send("Couldn't send OTP");
//         }

//         savedOTPS[email] = otp;
//         setTimeout(() => delete savedOTPS[email], 600000);
//         console.log(`✅ OTP sent to ${email}: ${otp}`);
//         res.send("Sent OTP");
//     });
// });

// // ✅ Verify OTP
// app.post('/verify', (req, res) => {
//     const { email, otp } = req.body;
//     if (savedOTPS[email] === otp) {
//         return res.send("Verified");
//     } else {
//         return res.status(400).send("Invalid OTP");
//     }
// });

// module.exports = app;






















const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
let savedOTPS = {};

// Middleware Configuration
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://demo-gni.gofastapi.com',
            'https://yourfrontenddomain.com',
            'http://localhost:5173',
            'http://localhost:3000'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// MongoDB Config
const uri = "mongodb+srv://Dhanush2002:Dhanush2002@cluster0.ool5p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;
let client;

async function connectToMongo() {
    if (db) return db;
    try {
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        await client.connect();
        db = client.db('Dhanush2002');
        console.log('✅ Connected to MongoDB');
        return db;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
}

// Email Transporter
const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
        user: "contact@gniapp.com",
        pass: "@Riosrogers99."
    }
});

// ✅ Check if email already exists
app.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required.' });

        const db = await connectToMongo();
        const existingUser = await db.collection('packageSubmissions').findOne({ email });

        return res.status(200).json({
            exists: !!existingUser,
            message: existingUser ? 'Email already subscribed.' : 'Email not found.'
        });
    } catch (error) {
        console.error('❌ Error checking email:', error);
        return res.status(500).json({ error: 'Failed to check email.' });
    }
});

// ✅ Contact form submission
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const db = await connectToMongo();
        const result = await db.collection('contact_details').insertOne({
            name,
            email,
            message,
            createdAt: new Date()
        });

        console.log('✅ Contact saved:', result.insertedId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Error inserting contact:', error);
        res.status(500).json({ error: 'Failed to submit contact form.' });
    }
});

// ✅ Get all contact submissions
app.get('/contact', async (req, res) => {
    try {
        const db = await connectToMongo();
        const entries = await db.collection('contact_details')
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json(entries);
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        res.status(500).json({ error: 'Server error while fetching contacts' });
    }
});

// ✅ Package details + confirmation email
app.post('/details', async (req, res) => {
    const { email, package: packageType } = req.body;
    if (!email || !packageType) return res.status(400).json({ error: 'Email and package type are required.' });

    try {
        const transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true,
            auth: {
                user: "contact@gniapp.com",
                pass: "@Riosrogers99."
            }
        });
const mailOptions = {
    from: 'GNI <contact@gniapp.com>',
    to: email,
    subject: `Confirmation: ${packageType} Package Selected`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h2 style="color: #1e3a8a; margin: 0;">Package Selection Confirmation</h2>
  </div>
  
  <div style="padding: 20px; background-color: #ffffff; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
    <p>Dear Customer,</p>
    
    <p>Thank you for selecting our <strong style="color: #1e40af;">${packageType}</strong> package. We appreciate your interest in our services.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 15px 0;">
      <h3 style="color: #1e3a8a; margin-top: 0;">Package Details</h3>
      <p style="margin: 5px 0;"><span style="color: #64748b;">• Selected Package:</span> <strong>${packageType}</strong></p>
      <p style="margin: 5px 0;"><span style="color: #64748b;">• Selection Date:</span> ${new Date().toDateString()}</p>
    </div>
  </div>
  
  <div style="padding: 20px; background-color: #f9fafb; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
    <h3 style="color: #1e3a8a; margin-top: 0;">Next Steps</h3>
    <p>Our team will review your selection and contact you if any additional information is required.</p>
  </div>
  
  <div style="padding: 20px; background-color: #eff6ff; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
    <h3 style="color: #1e3a8a; margin-top: 0;">Support Information</h3>
    <p>If you have any questions or need to modify your selection, please reply to this email or contact us at <span style="color: #2563eb;">contact@gniapp.com</span>.</p>
    
    <p style="margin-top: 20px;">We look forward to serving you.</p>
    
    <p style="color: #1e3a8a; font-weight: bold;">Best regards,</p>
    <p style="font-weight: bold; margin-bottom: 0;">The GNI App Team</p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
    <p>GNI App • Simple, Effective Solutions</p>
  </div>
</div>
    `,
    text: `[Keep the same plain text version from previous example as fallback]`
};

        await transporter.sendMail(mailOptions);

        const collection = db.collection('packageSubmissions');
        const newEntry = { email, packageType, createdAt: new Date() };
        await collection.insertOne(newEntry);

        console.log('✅ Confirmation sent & details saved:', newEntry);
        res.status(200).json({ message: 'Email sent and details saved.', data: newEntry });
    } catch (error) {
        console.error('❌ Error processing details:', error);
        res.status(500).json({ error: 'Failed to process your request.' });
    }
});

// ✅ Get all package submissions
app.get('/details', async (req, res) => {
    try {
        const db = await connectToMongo();
        const entries = await db.collection('packageSubmissions')
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json(entries);
    } catch (error) {
        console.error('❌ Error in GET /details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Send OTP
app.post('/sendotp', (req, res) => {
    const email = req.body.email;
    const otp = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');

    const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true,
        auth: {
            user: "contact@gniapp.com",
            pass: "@Riosrogers99."
        }
    });

    const mailOptions = {
    from: 'GNI <contact@gniapp.com>',
    to: email,
    subject: "GNI App Verification Code",
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h2 style="color: #1e3a8a; margin: 0;">Email Verification</h2>
  </div>
  
  <div style="padding: 20px; background-color: #ffffff; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
    <p>Dear User,</p>
    
    <p>Please use the following verification code to complete your authentication:</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center;">
      <h3 style="color: #1e3a8a; margin-top: 0; margin-bottom: 10px;">Your Verification Code</h3>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1e40af; margin: 15px 0;">${otp}</div>
      <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">This code will expire in 10 minutes</p>
    </div>
    
    <p>For security reasons, please do not share this code with anyone.</p>
  </div>
  
  <div style="padding: 20px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
    <h3 style="color: #1e3a8a; margin-top: 0;">Need Help?</h3>
    <p>If you didn't request this code, please ignore this email or contact support at <span style="color: #2563eb;">contact@gniapp.com</span>.</p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
    <p>GNI App • Secure Authentication</p>
  </div>
</div>
    `,
    text: `
GNI App - Email Verification

Dear User,

Your verification code is: ${otp}

This code will expire in 60 seconds.

For security reasons, please do not share this code with anyone.

If you didn't request this code, please ignore this email or contact support at contact@gniapp.com.

--
GNI App
Secure Authentication
`.trim()
};
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(`❌ OTP send error: ${error}`);
                return res.status(500).send("Couldn't send OTP");
            }

            savedOTPS[email] = otp;
            setTimeout(() => delete savedOTPS[email], 60000);
            console.log(`✅ OTP sent to ${email}: ${otp}`);
            res.send("Sent OTP");
        });
    } catch (error) {
        console.error('❌ sendotp error:', error);
        res.status(500).send("Internal server error");
    }
});

// ✅ Verify OTP
app.post('/verify', (req, res) => {
    try {
        const { email, otp } = req.body;
        if (savedOTPS[email] === otp) {
            return res.send("Verified");
        } else {
            return res.status(400).send("Invalid OTP");
        }
    } catch (error) {
        console.error('❌ verify error:', error);
        res.status(500).send("Internal server error");
    }
});

// ✅ Serverless Export
module.exports = app;
