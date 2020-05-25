import firebaseAdmin from "firebase-admin";
import config from "./config";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      private_key: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: config.FIREBASE_CLIENT_EMAIL,
      project_id: config.FIREBASE_PROJECT_ID,
    }),
    databaseURL: `https://${config.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

export default firebaseAdmin;
