import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import { app } from "../firebase.config";
import { useState } from "react";
import { useAppSelector } from "../hook";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
export default function CreatePost() {
  const navigate = useNavigate();

  const { currentUser } = useAppSelector((state) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadImageError, setUploadImageError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  console.log(formData);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setPostError(null);
    try {
      const req = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, author: currentUser?._id }),
      });
      const res = await req.json();
      console.log(res);

      if (res.ok) {
        navigate(`/post/${res.data._id}`);
      }
      throw new Error("");
    } catch (error) {
      setPostError("somthing went wrong when try to puplish the post");
      console.log(error);
    }
  }
  async function uploadImage() {
    if (!imageFile) {
      setUploadImageError("please select an image");
      return;
    }
    try {
      setUploadImageError(null);
      setLoading(true);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile?.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setUploadImageError(
            ` ${error.name}: Could not upload image (file must be less than 3MB)`
          );
          setUploadProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((res) => {
            setImageFileUrl(res);
            setFormData({ ...formData, imageUrl: res });
            setLoading(false);
          });
        }
      );
    } catch (error) {
      setUploadImageError("faild to upload");
      setUploadProgress(null);
      console.log(error);
    }
  }

  const handelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          >
            <option value="uncategorized">Select Catgeory</option>
            <option value="js">Javascript</option>
            <option value="react">React</option>
            <option value="next">Next</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 ">
          <FileInput accept="image/*" onChange={handelImageChange} />
          <Button
            type="button"
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            outline
            onClick={uploadImage}
            disabled={loading}
          >
            {loading ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={parseInt(uploadProgress!)}
                  text={`${parseInt(uploadProgress!)}%`}
                  strokeWidth={6}
                />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {uploadImageError ? (
          <Alert color={"failure"}>{uploadImageError}</Alert>
        ) : (
          ""
        )}
        {/* //@ts-expect-error sss */}
        {imageFileUrl ? (
          <img
            src={imageFileUrl}
            alt="upload"
            className="w-full h-72 object-cover"
          ></img>
        ) : (
          ""
        )}
        <ReactQuill
          theme="snow"
          placeholder="write something"
          className="h-72 mb-12"
          id="content"
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"} size={"md"}>
          Puplish
        </Button>
        {postError ? <Alert color={"failure"}>{postError}</Alert> : ""}
      </form>
    </div>
  );
}
