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
          <div className="intro">
            <Head>
              <title>Shared Music Queue</title>
            </Head>
            <p className="introText">
              Welcome to the Shared Music Queue web app! You no longer have to
              pass a phone around so that everyone can add a song to the queue.
              Trying to create the ultimate study playlist? Want to create a
              party playlist that you and your friends can dance to? Look no
              further! Simply create a room and share the room code with your
              friends to get started!
            </p>
          </div>
          <div data-cy="create_room" className="createRoom">
            <h1 className="headers">Create Room</h1>
            <CreateRoom user={user} database={firebase}></CreateRoom>
            <p className="createParaText">
              Create a room for you and your friends to make the ultimate music
              queue.
            </p>
          </div>
          <div data-cy="join_room" className="joinRoom">
            <h1 className="headers">Join Room</h1>
            <JoinRoom user={user} database={firebase}></JoinRoom>
            <p className="paraText">
              Did your friends already create a room? Enter the room ID to join!
            </p>
          </div>
          <div className="howItWorks">
            <h1 className="headers">How It Works</h1>
            <p className="paraText">
              Our production is a shared multi-user queue with an admin-control
              system. Once you create a room, you can share the room ID with
              your friends to start creating your group playlist. The app has
              search functionality to find music through the Youtube API, and
              allows you to add, upvote, and downvote songs. The ordering of the
              songs in the queue is based on their overall score. Admin-control
              gives the creator the ability to monitor the room by having skip,
              pause/play authority as well as banning users.
            </p>
          </div>
        </div>
      ) : (
        <div data-cy="not_logged">
          <p className="introText">
            Welcome to the Shared Music Queue web app! You no longer have to
            pass a phone around so that everyone can add a song to the queue.
            Trying to create the ultimate study playlist? Want to create a party
            playlist that you and your friends can dance to? Log in to get
            started!
          </p>
        </div>
      )}
      <style jsx>{`
        .createRoom {
          position: relative;
          text-align: center;
          top: 100px;
          background-image: linear-gradient(
            185deg,
            rgb(0, 255, 176),
            rgb(0, 199, 255)
          );
          width: 50%;
          height: 200px;
        }
        .joinRoom {
          position: relative;
          text-align: center;
          bottom: 100px;
          left: 556px;
          background-image: linear-gradient(
            185deg,
            rgb(0, 255, 176),
            rgb(0, 199, 255)
          );
          width: 50%;
          height: 200px;
        }
        .intro {
          text-align: center;
          position: relative;
          top: 10px;
        }
        .headers {
          text-align: center;
          padding: 5pt;
          font-family: "Georgia", serif;
        }
        .introText {
          text-align: center;
          font-family: "Georgia", serif;
          font-size: 15pt;
          padding-top: 20px;
        }
        .paraText {
          text-align: center;
          padding-top: 10pt;
          font-family: "Georgia", serif;
          padding-bottom: 10pt;
          padding-right: 10pt;
          padding-left: 10pt;
        }
        .createParaText {
          text-align: center;
          padding-top: 22pt;
          font-family: "Georgia", serif;
          padding-bottom: 10pt;
          padding-right: 10pt;
          padding-left: 10pt;
        }
        .howItWorks {
          position: relative;
          bottom: 99px;
          background-image: linear-gradient(
            185deg,
            rgb(0, 255, 176),
            rgb(0, 199, 255)
          );
        }
      `}</style>
    </Layout>
  );
}

export default HomePage;
