import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hook";
import { signOut } from "../../redux/slices/user";
const DashboardBar = ({ tab }: { tab: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
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
