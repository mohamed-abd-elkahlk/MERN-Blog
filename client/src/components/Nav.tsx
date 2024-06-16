import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { navLinks } from "../constants";
import { useAppSelector } from "../hook";
const Nav = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl  font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Matrix's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden self-center" pill color={"gray"}>
        <AiOutlineSearch />
      </Button>
      <div className=" flex gap-3 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color={"gray"} pill>
          <FaMoon />
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            label={
              <Avatar
                alt="user"
                // TODO: add defult and image ref
                img={currentUser.imageUrl}
                rounded
              />
            }
            inline
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Link>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone={"purpleToBlue"} pill outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {navLinks.map((link) => (
          <Navbar.Link key={link.id} active={path === link.href} as={"div"}>
            <Link to={link.href}>{link.title}</Link>
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
