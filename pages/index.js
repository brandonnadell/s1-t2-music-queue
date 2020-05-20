import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const { user } = props;

  return (
    <Layout user={user}>
      {user ? (
        <div>
          <div>
            <CreateRoom user={user}></CreateRoom>
          </div>
          <div>
            <JoinRoom></JoinRoom>
          </div>
        </div>
      ) : (
        <div>You're not logged in!</div>
      )}
    </Layout>
  );
}

export default HomePage;
