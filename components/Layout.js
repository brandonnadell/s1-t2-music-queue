import Container from "react-bootstrap/Container";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

function Layout(props) {
  const user = props.user;

  return (
    <>
      <AppNavbar user={user} database={props.database} />
      <Container>{props.children}</Container>
      <AppFooter />
    </>
  );
}

export default Layout;
