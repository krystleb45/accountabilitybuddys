import * as admin from "firebase-admin";
import serviceAccount from "./firebase-service-account-key.json";

// Cast the service account to the correct type
const typedServiceAccount = serviceAccount as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(typedServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://your-project.firebaseio.com",
  });
}

export default admin;
