import { Outlet } from "react-router-dom";
import { useAppSelector } from "../hook";
import Unauthorised from "../pages/Unauthorised";
const AdminPrivteRoutes = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  return currentUser?.role === "admin" ? <Outlet /> : <Unauthorised />;
};

export default AdminPrivteRoutes;
