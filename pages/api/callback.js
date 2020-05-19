import auth0 from "../../utils/auth0";
import fetch from "../../utils/fetch";
import firebase from "../../client/firebase";
import firebaseAdmin from "../../utils/firebase_admin";

export default async function (req, res) {
  try {
    await auth0.handleCallback(req, res, {
      onUserLoaded: async (req, res, session, state) => {
        const { sub: uid } = session.user;
        const firebaseToken = await firebaseAdmin.auth().createCustomToken(uid);
        if (session.user) session.user.firebaseToken = firebaseToken;
        return session;
      },
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
