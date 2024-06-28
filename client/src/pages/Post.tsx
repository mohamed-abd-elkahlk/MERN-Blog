import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IPost } from "../types";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/shared/CallToAction";
import Comments from "../components/shared/CommentsSection";
import { useAppSelector } from "../hook";
import PostCard from "../components/shared/PostCard";
export default function Post() {
  const { id } = useParams();
  const { currentUser } = useAppSelector((state) => state.user);
  const [post, setPost] = useState<IPost>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentPosts, setRecentPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetechOnePost = async () => {
      setError(false);
      setLoading(true);
      try {
        const req = await fetch(`/api/post/${id}`);
        if (req.ok) {
          const res = await req.json();
          setPost(res.data);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    const fetechRecenPosts = async () => {
      setError(false);
      setLoading(true);
      try {
        const req = await fetch(`/api/post?limit=3`);
        if (req.ok) {
          const res = await req.json();
          setRecentPosts(res.data);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetechOnePost();
    fetechRecenPosts();
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
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      {currentUser && post ? (
        // @ts-expect-error user type reflect between user form redux and user from Database
        <Comments postId={post._id} user={currentUser} />
      ) : (
        <div className="max-w-4xl mx-auto w-full p-3">
          <div className="text-sm text-teal-500 my-5 flex gap-1">
            <h2>you must log in to comment.</h2>
            <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
              Sign In
            </Link>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5"> Recent articales</h1>
        <div className="flex flex-wrap gap-5 justify-center mt-5">
          {recentPosts.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
