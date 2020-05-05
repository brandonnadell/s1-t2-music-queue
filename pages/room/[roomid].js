import { useRouter } from "next/router";
import AppNavBar from "../../components/AppNavbar";
import AppFooter from "../../components/AppFooter";

const Room = () => {
  const router = useRouter();
  const { roomid } = router.query;

  return (
    <>
      <AppNavBar />
      <p>Room: {roomid}</p>
      <AppFooter />
    </>
  );
};

export default Room;
