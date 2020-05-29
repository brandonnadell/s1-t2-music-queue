import auth0 from "./auth0";
import { getTestAuthSession } from "./testAuth";
import config from "./config";

const getSharedComponentData = (session) => ({
  props: {
    user: session.user,
  },
});

export async function getUserSession(req) {
  let session;
  if (config.USE_TEST_AUTH) {
    session = getTestAuthSession(req);
  } else {
    session = await auth0.getSession(req);
  }

  if (session) {
    return session;
  }

  return null;
}

export async function optionalAuth({ req }) {
  const session = await getUserSession(req);

  if (session && session.user) {
    return getSharedComponentData(session);
  }

  return { props: {} };
}

export async function requiredAuth({ req, res }) {
  const session = await getUserSession(req);

  if (session && session.user) {
    return getSharedComponentData(session);
  }

  res.writeHead(302, {
    Location: "/api/login",
  });
  res.end();
}
