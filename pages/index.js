import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import firebase from "../client/firebase";
import Head from "next/head";
import Jumbotron from "react-bootstrap/Jumbotron";
// import Background from "../images/musicBg.png";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const { user } = props;
  return (
    <Layout data-cy="layout" user={user} database={firebase}>
      {user ? (
        <div data-cy="room_home" style={{}}>
          <div className="intro">
            <Head>
              <title>Shared Music Queue</title>
            </Head>
            <div className="introText">
              Welcome to the Shared Music Queue web app! You no longer have to
              pass a phone around so that everyone can add a song to the queue.
              Trying to create the ultimate study playlist? Want to create a
              party playlist that you and your friends can dance to? Look no
              further! Simply create a room and share the room code with your
              friends to get started!
            </div>
          </div>
          <div
            style={{ display: "flex", flexFlow: "column", marginTop: "-5%" }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              <div
                data-cy="create_room"
                style={{ flex: 1, display: "flex", alignItems: "center" }}
                className="createRoom"
              >
                <div
                  style={{
                    fontSize: "30px",
                    textAlign: "center",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    fontStyle: "oblique",
                  }}
                >
                  Create a Room!
                </div>
                <CreateRoom user={user} database={firebase}></CreateRoom>
                <div className="createParaText">
                  Create a room for you and your friends to make the ultimate
                  music queue.
                </div>
              </div>
              <div
                data-cy="join_room"
                style={{ flex: 1, display: "flex", alignItems: "center" }}
                className="joinRoom"
              >
                <div
                  style={{
                    fontSize: "30px",
                    textAlign: "center",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    fontStyle: "oblique",
                  }}
                >
                  Join an existing Room!
                </div>
                <JoinRoom user={user} database={firebase}></JoinRoom>
                <div className="paraText">
                  Did your friends already create a room? Enter the room ID to
                  join!
                </div>
              </div>
            </div>
            <div className="howItWorks" style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "30px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontStyle: "oblique",
                }}
              >
                How it Works!
              </div>
              <div className="paraText">
                Our Production is a shared multi-user queue with an
                admin-control system. Once you create a room, you can share the
                room ID with your friends to start creating your group playlist.
                The app has search functionality to find music through the
                Youtube API, and allows you to add, upvote, and downvote songs.
                The ordering of the songs in the queue is based on their overall
                score. Admin-control gives the creator the ability to monitor
                the room by having skip, pause/play authority as well as banning
                users.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div data-cy="not_logged">
          <div className="introText">
            Welcome to the Shared Music Queue web app! You no longer have to
            pass a phone around so that everyone can add a song to the queue.
            Trying to create the ultimate study playlist? Want to create a party
            playlist that you and your friends can dance to? Log in to get
            started!
          </div>
        </div>
      )}
      <style jsx>{`
        .createRoom,
        .joinRoom,
        .howItWorks {
          border-radius: 10px;
          border: 2px whitesmoke solid;
          background-color: rgba(0, 0, 0, 0.5);
          color: whitesmoke;
        }
        .createRoom {
          position: relative;
          text-align: center;
          float: left;
          display: flex;
          flex-flow: column nowrap;
          margin-top: 15%;
          width: 50%;
        }
        .joinRoom {
          position: relative;
          text-align: center;
          display: flex;
          float: left;
          flex-flow: column nowrap;
          margin-top: 15%;
          width: 50%;
        }
        .intro {
          text-align: center;
          position: relative;
          top: 10px;
        }
        .introText {
          text-align: center;
          font-size: 15pt;
          padding-top: 20px;
          color: whitesmoke;
        }
        .paraText {
          text-align: center;
          padding-top: 10pt;
          padding-bottom: 10pt;
          padding-right: 10pt;
          padding-left: 10pt;
        }
        .createParaText {
          text-align: center;
          padding-top: 22pt;
          padding-bottom: 10pt;
          padding-right: 10pt;
          padding-left: 10pt;
        }
        .howItWorks {
          position: relative;
        }
      `}</style>
    </Layout>
  );
}

export default HomePage;
