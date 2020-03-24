require('dotenv/config');
var admin = require("firebase-admin");
var serviceAccount = process.env.FIREBASE_CONFIG;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: "https://tic-tac-toe-c52ff.firebaseio.com"
});

const db = admin.database();

module.exports = db;