import React, { useEffect, useState } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import firebase from "../../services/firebaseConfig";
import img1 from "../../assets/images/btn_google_signin_dark_normal_web.png";

const AccountPage = () => {
  const [uIState, setUIState] = useState("loading");
  const [loading, setloading] = useState(false);
  const [alreadyUsedPopUpShow, setalreadyUsedPopUpShow] = useState(false);
  const [signOutPopUpShow, setSignOutPopUpShow] = useState(false);
  const [alreadyUsedEmail, setalreadyUsedEmail] = useState("");

  var provider = new firebase.auth.GoogleAuthProvider();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.isAnonymous) setUIState("anonymous");
        else setUIState("logedin");
      } else {
        setUIState("notlogedin");
      }
    });
  }, []);

  const signIn = () => {
    setloading(true);
    provider.setCustomParameters({
      prompt: "select_account",
    });
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((user) => {
            setloading(false);
          })
          .catch((e) => {
            setloading(false);
            console.log(e);
          });
      });
  };

  const linkAcount = () => {
    setloading(true);
    provider.setCustomParameters({
      prompt: "select_account",
    });
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase
          .auth()
          .currentUser.linkWithPopup(provider)
          .then(() => {
            setloading(false);
            setUIState("logedin");
          })
          .catch((e) => {
            setloading(false);
            if (e.code === "auth/credential-already-in-use") {
              setalreadyUsedEmail(e.email);
              setalreadyUsedPopUpShow(true);
            }
          });
      });
  };

  const AlreadyUsedPopUp = ({ show, onHide }) => {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="delete-modal"
        animation={false}
      >
        <Modal.Body>
          <h4>Account already in use</h4>
          <p>{`${alreadyUsedEmail} is already used `}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
          <Button variant="success" onClick={signIn}>
            {loading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            {`SignIn with ${alreadyUsedEmail}`}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const SignOutPopUp = ({ show, onHide }) => {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="delete-modal"
        animation={false}
      >
        <Modal.Body>
          <h4>Sign out From</h4>
          <h5>{firebase.auth().currentUser.email}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
          <Button variant="warning" onClick={signOut}>
            {loading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            Sign Out
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
      });
  };

  const signInAnonymouslyBtn = () => {
    setloading(true);
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
      });
  };

  switch (uIState) {
    case "notlogedin":
      return (
        <div
          style={{
            width: "100vw",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#1f2223",
          }}
        >
          <Button
            onClick={signInAnonymouslyBtn}
            disabled={loading}
            variant="secondary"
          >
            {loading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            SignIn Anonymously
          </Button>
          <Button
            onClick={signIn}
            disabled={loading}
            variant="dark"
            style={{ padding: 0, marginTop: 24 }}
          >
            {loading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            <img src={img1} alt={"Sign In with Google"} />
          </Button>
        </div>
      );
      break;

    case "logedin":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
            marginBottom: 64,
            padding: 8,
            background: "#1f2223",
          }}
        >
          <SignOutPopUp
            show={signOutPopUpShow}
            onHide={() => {
              setSignOutPopUpShow(false);
            }}
          />
          <div
            style={{
              color: "#a0a0a0",
              textAlign: "center",
              fontSize: "1.6rem",
              marginTop: 12,
            }}
          >
            Name:
          </div>
          <div
            style={{
              color: "#a0a0a0",
              textAlign: "center",
              fontSize: "1.4rem",
            }}
          >
            {firebase.auth().currentUser.displayName}
          </div>
          <div
            style={{
              color: "#a0a0a0",
              textAlign: "center",
              fontSize: "1.6rem",
              marginTop: 12,
            }}
          >
            Email:
          </div>
          <div
            style={{
              color: "#a0a0a0",
              textAlign: "center",
              fontSize: "1.4rem",
            }}
          >
            {firebase.auth().currentUser.email}
          </div>
          <Button
            style={{ margin: 32 }}
            onClick={() => {
              setSignOutPopUpShow(true);
            }}
            variant="warning"
          >
            Sign Out
          </Button>
        </div>
      );
      break;

    case "anonymous":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
            marginBottom: 64,
            padding: 8,
            background: "#1f2223",
          }}
        >
          <AlreadyUsedPopUp
            show={alreadyUsedPopUpShow}
            onHide={() => {
              setalreadyUsedPopUpShow(false);
            }}
          />
          <div
            style={{
              color: "#a0a0a0",
              textAlign: "center",
              fontSize: "1.4rem",
              marginTop: 12,
            }}
          >
            You are signed in with Anonymus Account
          </div>
          <div
            style={{
              color: "#a0a0a0",
              textAlign: "center",
              fontSize: "1.4rem",
              margin: 12,
            }}
          >
            Sign up with google to retain all meal details
          </div>
          <Button
            onClick={linkAcount}
            disabled={loading}
            variant="dark"
            style={{ width: 220 }}
          >
            {loading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            <img src={img1} alt={"Sign In with Google"} />
          </Button>
        </div>
      );
      break;

    default:
      return (
        <div style={{ position: "absolute", left: "48vw", top: "49vh" }}>
          <Spinner animation="border" variant="success" />
        </div>
      );
      break;
  }
};

export default AccountPage;
