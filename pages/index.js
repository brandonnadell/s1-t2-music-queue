import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";
import CreateRoom from "../components/CreateRoom";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const user = props.user;

  return (
    <Layout user={user}>
      {user ? (
        <div>
          <CreateRoom user={user}></CreateRoom>
        </div>
      ) : (
        <div>You're not logged in!</div>
      )}
    </Layout>
  );
}

export default HomePage;
