import { useRouter } from "next/router";
import AppNavBar from "../../components/AppNavbar";
import AppFooter from "../../components/AppFooter";
import { requiredAuth } from "../../utils/ssr";

export const getServerSideProps = requiredAuth;

const Room = (props) => {
  const user = props.user;
  const router = useRouter();
  const { roomid } = router.query;

  return (
    <>
      <AppNavBar user={user} />
      <p>Room: {roomid}</p>
      <AppFooter />
    </>
  );
};

export default Room;
