import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import firebase from "../client/firebase";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const { user } = props;
  console.log(user);
  return (
    <Layout user={user} database={firebase}>
      {user ? (
        <div>
          <div>
            <CreateRoom user={user} database={firebase}></CreateRoom>
          </div>
          <div>
            <JoinRoom database={firebase}></JoinRoom>
          </div>
        </div>
      ) : (
        <div>You're not logged in!</div>
      )}
    </Layout>
  );
}

export default HomePage;
