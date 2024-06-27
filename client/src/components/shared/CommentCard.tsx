import { useEffect, useState } from "react";
import { ICommnets, IUser } from "../../types";
import moment from "moment";
import { useAppSelector } from "../../hook";
import { Button, Textarea } from "flowbite-react";
export default function CommentCard({
  data,
  onEdit,
  onDelete,
}: {
  data: ICommnets;
  onEdit: (comment: ICommnets, editedComment: string) => void;
  onDelete: (commentId: string, postId: string) => void;
}) {
  const [user, setUser] = useState<IUser>();
  const [coment, setComment] = useState(data.content);
  const [edit, setEdit] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    async function getUser() {
      const req = await fetch(`/api/user/${data.userId}`);
      const res = await req.json();
      if (res.data) return setUser(res.data);
    }
    getUser();
  }, [data]);
  function handleEdit() {
    setEdit(true);
  }
  async function handleSave() {
    try {
      const req = await fetch(
        `/api/comment/update/${data._id}?userId=${currentUser?._id}&postId=${data._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: coment,
          }),
        }
      );
      if (req.ok) {
        setEdit(false);
        onEdit(data, coment);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user?.imageUrl}
          alt={user?.username}
          className="h-10 w-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user?.username}` : "anonymous"}
          </span>

          <span className="text-gray-500 text-xm">
            {moment(data.createdAt).fromNow()}
          </span>
        </div>
        {edit ? (
          <>
            <Textarea
              className="w-full mb-2"
              rows={3}
              value={coment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                outline
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{data.content}</p>
            {currentUser &&
              (currentUser._id === data.userId ||
                currentUser.role === "admin") && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(data._id, data.postId)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
