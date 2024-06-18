import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hook";
const PrivteRoutes = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />;
};

export default PrivteRoutes;
