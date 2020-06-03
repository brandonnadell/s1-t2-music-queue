import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import firebase from "../client/firebase";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const { user } = props;
  return (
    <Layout data-cy="layout" user={user} database={firebase}>
      {user ? (
        <div data-cy="room_home">
          <div data-cy="create_room">
            <CreateRoom user={user} database={firebase}></CreateRoom>
          </div>
          <div data-cy="join_room">
            <JoinRoom user={user} database={firebase}></JoinRoom>
          </div>
        </div>
      ) : (
        <div data-cy="not_logged">You're not logged in!</div>
      )}
    </Layout>
  );
}

export default HomePage;
