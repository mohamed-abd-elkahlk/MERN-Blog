import { useEffect, useState } from "react";
import { useAppSelector } from "../../hook";
import { IUser } from "../../types";
import { Button, Table } from "flowbite-react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashboardUsers() {
  const { currentUser } = useAppSelector((state) => state.user);
  const [userData, setUserData] = useState<IUser[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [page, setPage] = useState(2);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const req = await fetch(`/api/user/`, {
          method: "GET",
        });
        const res = await req.json();

        if (res.data) {
          setUserData(res.data);

          if (res.data.results < 7 || res.data.length === res.results) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser?._id, currentUser?.role]);
  async function handleShowMore() {
    try {
      const req = await fetch(`/api/post/user?&page=${page}`, {
        method: "GET",
      });
      const res = await req.json();

      if (res.data) {
        setUserData((prev) => [...prev, ...res.data]);

        if (res.pagenation.next) {
          setPage(res.pagenation.next);
        }
        if (res.pagenation.currenPage === page) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDelete(id: string) {
    try {
      const req = await fetch(`/api/user/delete-user/${id}`, {
        method: "DELETE",
      });
      if (req.ok) {
        setUserData((prev) => prev.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300  ">
      {currentUser?.role === "admin" && userData?.length > 0 ? (
        <>
          <Table className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userData.map((user) => (
                <Table.Row
                  key={user._id}
                  className=" bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.imageUrl || "/profile-defult.png"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.role === "admin" ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleDelete(user._id)}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore ? (
            <Button
              onClick={handleShowMore}
              type="button"
              outline
              className="w-full text-teal-500 text-center text-sm "
            >
              Show more
            </Button>
          ) : (
            ""
          )}
        </>
      ) : (
        <p>you don't have post yet</p>
      )}
    </div>
  );
}
