import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import firebase from "../client/firebase";
import Head from "next/head";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const { user } = props;
  return (
    <Layout data-cy="layout" user={user} database={firebase}>
      {user ? (
        <div data-cy="room_home">
          <div data-cy="create_room">
            <CreateRoom user={user} database={firebase}></CreateRoom>
            <p className="paraText">
              Create a room for you and your friends to create the ultimate
              music queue.
            </p>
          </div>
          <div data-cy="join_room">
            <JoinRoom user={user} database={firebase}></JoinRoom>
          </div>
          <div className="howItWorks">
            <h1 className="headers">How It Works</h1>
            <p>
              Once you create a room, you can share the room with your friends
              and start creating your group playlist. The order of the queue is
              based off of a voting system. Each person in the queue can upvote
              or downvote a song and the overall score decides its placement in
              the queue.
            </p>
          </div>
        </div>
      ) : (
        <div data-cy="not_logged">You're not logged in!</div>
      )}
      <style jsx>{`
        .createRoom {
          position: relative;
          text-align: center;
          top: 250px;
          background-image: linear-gradient(
            185deg,
            rgb(0, 255, 176),
            rgb(0, 199, 255)
          );
          background-size: cover;
          margin-left: 0px;
          margin-right: 0px;
        }
        .intro {
          text-align: center;
          position: relative;
          top: 10px;
        }
        .headers {
          text-align: center;
          padding: 5pt;
        }
        .paraText {
          text-align: center;
          padding-top: 10pt;
          padding-bottom: 30pt;
        }
        .howItWorks {
          position: relative;
          top: 750px;
          background-image: linear-gradient(
            185deg,
            rgb(166, 143, 244),
            rgb(126, 229, 184)
          );
        }
      `}</style>
    </Layout>
  );
}

export default HomePage;
