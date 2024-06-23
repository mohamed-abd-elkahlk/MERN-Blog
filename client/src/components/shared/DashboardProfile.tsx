import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../hook";
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.config";
import { deleteUser, signOut, updateUser } from "../../redux/slices/user";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const DashboardProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadImageError, setUploadImageError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  async function uploadImage() {
    if (!imageFile) return;
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
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUserError("nothing canged");
      setUserSuccess(null);
      return;
    }
    setLoading(true);
    try {
      const req = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const res = await req.json();

      if (res.data) {
        dispatch(updateUser(res.data));
        setUserSuccess("user profile updated successfully");
        setUserError(null);
        setFormData({});
      }
    } catch (error) {
      setUserSuccess(null);
      setUserError("somthing went wrong please try again later");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete() {
    setShowModel(false);
    try {
      await fetch(`api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });

      navigate("/");
      dispatch(deleteUser());
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSignOut() {
    try {
      const req = await fetch(`api/user/sign-out`, {
        method: "POST",
      });

      const res = await req.json();
      if (res.ok) {
        dispatch(signOut());
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handelImageChange}
          ref={inputFileRef}
          hidden
        />
        <div
          className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => inputFileRef.current?.click()}
        >
          {uploadProgress && (
            <CircularProgressbar
              value={parseInt(uploadProgress)}
              text={`${parseInt(uploadProgress)}%`}
              strokeWidth={6}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${parseInt(uploadProgress) / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.imageUrl}
            alt="User"
            className="rounded-full w-full border-8 border-[lightgray] object-cover"
          />
        </div>
        {uploadImageError ? (
          <Alert color={"failure"}>{uploadImageError}</Alert>
        ) : (
          ""
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />{" "}
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          disabled={loading}
        >
          Update
        </Button>
      </form>
      <div className="flex justify-between mt-5 text-red-500">
        <span className="cursor-pointer" onClick={() => setShowModel(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {userSuccess && (
        <Alert color={"success"} className="mt-5">
          {userSuccess}
        </Alert>
      )}
      {userError && (
        <Alert color={"failure"} className="mt-5">
          {userError}
        </Alert>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 texr-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account
            </h3>
            <div className="flex gap-4 justify-center">
              <Button color={"failure"} onClick={handleDelete}>
                Yes i'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModel(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardProfile;
