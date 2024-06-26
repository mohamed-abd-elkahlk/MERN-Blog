import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IPost } from "../types";
import { Button, Spinner } from "flowbite-react";
export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState<IPost>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetechOnePost = async () => {
      setError(false);
      setLoading(true);
      try {
        const req = await fetch(`/api/post/${id}`);
        if (req.ok) {
          const res = await req.json();
          setPost(res.data);
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetechOnePost();
  }, [id]);

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <Spinner size={"xl"} />{" "}
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen grid place-items-center">
        <h1 className="text-4xl text-center font-extrabold">404 NOT FOUND</h1>
      </div>
    );
  }
  return (
    <section className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10  p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>
      <Link
        className="self-center mt-5"
        to={`/search?category=${post?.category}`}
      >
        <Button color={"gray"} pill size={"xs"}>
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.imageUrl}
        alt="post-user"
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post?.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post?.content.length / 1000).toFixed(0)}mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post ? post.content : "" }}
      ></div>
    </section>
  );
}
