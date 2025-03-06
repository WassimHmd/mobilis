import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
// const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY || "{}");

console.log(serviceAccount.project_id);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
