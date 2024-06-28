import { Sidebar } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook";
import { signOut } from "../../redux/slices/user";
const DashboardBar = ({ tab }: { tab: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.role === "admin" ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.role === "admin" ? (
            <Link to={"/dashboard?tab=post"}>
              <Sidebar.Item
                active={tab === "post"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          ) : (
            ""
          )}
          {currentUser?.role === "admin" ? (
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          ) : (
            ""
          )}
          {currentUser?.role === "admin" ? (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          ) : (
            ""
          )}

          <Sidebar.Item
            onClick={async function handleSignOut() {
              try {
                const req = await fetch(`api/user/sign-out`, {
                  method: "POST",
                });

                const res = await req.json();
                if (res.ok) {
                  dispatch(signOut());
                  navigate("/");
                }
              } catch (error) {
                console.log(error);
              }
            }}
            icon={HiArrowSmRight}
            lable={"User"}
            labelColor="dark"
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardBar;
