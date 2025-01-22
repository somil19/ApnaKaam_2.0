import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import Footer from "./Footer";
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css";

export default function AppLayout() {
  // const signUpSuccess = useSelector((state) => state.signUp.signUpSuccess);
  const token = useSelector((state) => state.signUp.token);
  return (
    <>
      {token === "" ? (
        <SignUpPage />
      ) : (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}
