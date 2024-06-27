import { useEffect, useState } from "react";
import { ICommnets, IUser } from "../../types";
import moment from "moment";
export default function CommentCard({ data }: { data: ICommnets }) {
  const [user, setUser] = useState<IUser>();
  console.log(user);

  useEffect(() => {
    async function getUser() {
      const req = await fetch(`/api/user/${data.userId}`);
      const res = await req.json();
      if (res.data) return setUser(res.data);
    }
    getUser();
  }, [data]);

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
        <p className="text-gray-500 mb-2">{data.content}</p>
      </div>
    </div>
  );
}
