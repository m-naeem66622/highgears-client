import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Page404 from "../pages/Page404";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin === false ? <Outlet /> : <Page404 />;
};
export default PrivateRoute;
