import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/shared/PostCard";
import { IPost } from "../types";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    keyword: "",
    sort: "desc",
    category: "uncategorized",
  });

  console.log(sidebarData);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [nextPage, setNextPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const keywordFromUrl = urlParams.get("keyword");
    const sortFromUrl = urlParams.get("sort");
    if (keywordFromUrl) {
      setSidebarData({
        ...sidebarData,
        keyword: keywordFromUrl,
      });
      if (sortFromUrl) {
        setSidebarData({
          ...sidebarData,
          sort: sortFromUrl,
        });
      }
    }
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const req = await fetch(`/api/post?${searchQuery}`);
      if (!req.ok) {
        setLoading(false);
        return;
      }
      if (req.ok) {
        const res = await req.json();
        setPosts(res.data);
        setLoading(false);
        setNextPage(res.pagenation?.next);
        if (res.data.results === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.id === "keyword") {
      setSidebarData({ ...sidebarData, keyword: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("keyword", sidebarData.keyword);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", nextPage.toString());
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="keyword"
              type="text"
              value={sidebarData.keyword}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, keyword: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="react">React.js</option>
              <option value="next">Next.js</option>
              <option value="js">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
