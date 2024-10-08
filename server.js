const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

console.log('Environment Variables:');
console.log('FIREBASE_TYPE:', process.env.FIREBASE_TYPE);
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PRIVATE_KEY_ID:', process.env.FIREBASE_PRIVATE_KEY_ID);
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY);
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_CLIENT_ID:', process.env.FIREBASE_CLIENT_ID);
console.log('FIREBASE_AUTH_URI:', process.env.FIREBASE_AUTH_URI);
console.log('FIREBASE_TOKEN_URI:', process.env.FIREBASE_TOKEN_URI);
console.log('FIREBASE_AUTH_PROVIDER_CERT_URL:', process.env.FIREBASE_AUTH_PROVIDER_CERT_URL);
console.log('FIREBASE_CLIENT_CERT_URL:', process.env.FIREBASE_CLIENT_CERT_URL);

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
  'http://localhost:3000',
  'http://conso.nc',
  'https://conso.nc'
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
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/github-webhook', (req, res) => {
  console.log('Received GitHub webhook:', req.body);
  res.status(200).send('Webhook received');
});

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

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
