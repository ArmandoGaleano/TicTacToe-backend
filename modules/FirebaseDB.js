var admin = require("firebase-admin");

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tic-tac-toe-c52ff.firebaseio.com"
});

const db = admin.database();

module.exports = db;