const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://consotest.netlify.app',
  'https://conso-nc.vercel.app',
  'http://localhost:3000',
  /\.vercel\.app$/
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    if (allowedOrigins.some((allowedOrigin) => 
      typeof allowedOrigin === 'string' ? allowedOrigin === origin : allowedOrigin.test(origin)
    ) || !origin) {
      callback(null, true);
    } else {
      console.error('Not allowed by CORS');
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/secure-data', async (req, res) => {
  console.log('Received request for /secure-data');
  try {
    const data = await admin.firestore().collection('secure-collection').get();
    if (!data.empty) {
      const jsonData = data.docs.map(doc => doc.data());
      console.log('Data retrieved successfully:', jsonData);  
      res.json(jsonData);
    } else {
      console.log('No data found');  
      res.json([]);
    }
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

app.get('*', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.get('*', (req, res) => {
  console.log('Received request for', req.originalUrl);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), err => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
