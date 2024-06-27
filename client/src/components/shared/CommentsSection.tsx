import { Link, useNavigate } from "react-router-dom";
import { ICommnets, IUser } from "../../types";
import { Alert, Button, Spinner, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";

export default function Comments({
  postId,
  user,
}: {
  postId: string;
  user: IUser;
}) {
  const navigate = useNavigate();
  const [comments, setComments] = useState("");
  const [postComments, setPostComments] = useState<ICommnets[]>([]);
  const [loading, setLoading] = useState(false);
  const [commnetsLoading, setCommnetsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const req = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId: user._id, content: comments }),
      });
      const res = await req.json();
      if (!req.ok) {
        return setError(res.errors[0].msg);
      }

      setError(null);
      setComments("");
      setPostComments((prev) => [...prev, res.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(comment: ICommnets, editedComment: string) {
    setPostComments(
      postComments.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  }

  async function handleDelete(commentId: string, postId: string) {
    if (!user) {
      return navigate("/sign-in");
    }

    try {
      const req = await fetch(
        `/api/comment/delete/${commentId}?userId=${user?._id}&postId=${postId}`,
        {
          method: "DELETE",
        }
      );

      if (req.ok) {
        setPostComments(
          postComments.filter((coment) => coment._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getCommets() {
      setCommnetsLoading(true);
      try {
        const req = await fetch(`/api/comment/${postId}`);
        const res = await req.json();
        if (res.data) {
          setPostComments(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setCommnetsLoading(false);
      }
    }
    getCommets();
    return () => {};
  }, [postId]);

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
        <p>Signed In as:</p>
        <img
          src={user.imageUrl || "/profile-defult.png"}
          alt={user.username}
          className="h-5 w-5 object-cover rounded-full"
        />
        <Link
          to={`/dashboard?tab=profile`}
          className="text-xs text-cyan-600 hover:underline"
        >
          @{user.username}
        </Link>
      </div>
      <form
        className="border border-teal-500 rounded-md p-3"
        onSubmit={handleSubmit}
      >
        <Textarea
          placeholder="add comment..."
          rows={3}
          maxLength={200}
          onChange={(e) => setComments(e.target.value)}
          value={comments}
        />
        <div className="flex justify-between items-center mt-5">
          <p className="text-gray-500 text-xs">
            {200 - comments.length} charactes remaining
          </p>
          <Button
            outline
            gradientDuoTone={"purpleToBlue"}
            type="submit"
            disabled={loading}
          >
            {loading ? "loading..." : "Submit"}
          </Button>
        </div>
        {error ? (
          <Alert color={"failure"} className="mt-5">
            <h3 className="font-bold">{error}</h3>
          </Alert>
        ) : (
          ""
        )}
      </form>
      {postComments?.length === 0 ? (
        <p className="text-sm my-5">no comments</p>
      ) : (
        <>
          <div className="text-sm my-5 flex  items-center gap-1">
            <p>Commnets</p>
            <div className="border border-gray-500 py-1 px-2 rounded-sm">
              <p>{postComments?.length}</p>
            </div>
          </div>
          {commnetsLoading ? (
            <div className="grid place-items-center h-screen">
              <Spinner size={"xl"} />{" "}
            </div>
          ) : (
            postComments?.map((comment) => (
              <CommentCard
                key={comment._id}
                data={comment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}
