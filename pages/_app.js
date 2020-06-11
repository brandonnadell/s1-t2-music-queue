import "bootstrap/dist/css/bootstrap.min.css";
import firebaseClient from "../client/firebase";
import "../styles.css";

async function initFirebaseClient(user) {
  const firebaseToken = user.firebaseToken;
  await firebaseClient.setToken(firebaseToken);
  const userProfile = { name: user.name, picture: user.picture };
  await firebaseClient.updateProfile(userProfile);
}

function MyApp({ Component, pageProps }) {
  if (pageProps && pageProps.user) initFirebaseClient(pageProps.user);
  return <Component {...pageProps} />;
}

export default MyApp;
