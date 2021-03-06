import Link from "next/link";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { loadGetInitialProps } from "next/dist/next-server/lib/utils";

async function logOut(database) {
  if (window) window.location.href = "/api/logout";
  database.signOut();
}

function AppNavbar(props) {
  const user = props.user;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <a href="/">
          <Navbar.Brand>Shared Music Queue</Navbar.Brand>
        </a>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <>
                    Hi, {user.name}
                    <Image
                      className="ml-2"
                      src={user.picture}
                      width={24}
                      height={24}
                    />
                  </>
                }
              >
                <NavDropdown.Item
                  className="text-danger"
                  onClick={() => logOut(props.database)}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button data-cy="login" href="/api/login">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
