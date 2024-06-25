import { useEffect, useState } from "react";
import { useAppSelector } from "../../hook";
import { IPost } from "../../types";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardPosts() {
  const { currentUser } = useAppSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [page, setPage] = useState(2);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const req = await fetch(
          `/api/post/getpost?author=${currentUser?._id}`,
          {
            method: "GET",
          }
        );
        const res = await req.json();
        if (res.data) {
          setUserPosts(res.data);

          if (res.data.results < 5) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.role === "admin") {
      fetchPosts();
    }
  }, [currentUser?._id, currentUser?.role]);
  async function handleShowMore() {
    try {
      const req = await fetch(
        `/api/post/getpost?author=${currentUser?._id}&page=${page}`,
        {
          method: "GET",
        }
      );
      const res = await req.json();

      if (res.data) {
        setUserPosts((prev) => [...prev, ...res.data]);

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
      const req = await fetch(
        `/api/post/delete-post/${id}?userId=${currentUser?._id}`,
        {
          method: "DELETE",
        }
      );
      if (req.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300  ">
      {currentUser?.role === "admin" && userPosts?.length > 0 ? (
        <>
          <Table className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className=" bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-20 h-20 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleDelete(post._id)}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500  hover:underline"
                    >
                      <span>Edit</span>
                    </Link>
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
