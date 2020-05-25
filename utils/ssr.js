import auth0 from "./auth0";

const getSharedComponentData = (session) => ({
  props: {
    user: session.user,
  },
});

export async function optionalAuth({ req }) {
  const session = await auth0.getSession(req);

  if (session && session.user) {
    return getSharedComponentData(session);
  }

  return { props: {} };
}

export async function requiredAuth({ req, res }) {
  const session = await auth0.getSession(req);

  if (session && session.user) {
    return getSharedComponentData(session);
  }

  res.writeHead(302, {
    Location: "/api/login",
  });
  res.end();
}
