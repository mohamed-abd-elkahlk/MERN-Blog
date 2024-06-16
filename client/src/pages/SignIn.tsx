import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hook";
import OAuth from "../components/shared/OAuth";
import { signIn } from "../redux/slices/user";

const SginIn = () => {
  const dispatch = useAppDispatch();
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [erorrs, setErrors] = useState<null | string>(null);

  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    dispatch(signIn(formData))
      .unwrap()
      .then((res) => {
        console.log(res);

        if (res.ok) navigate("/");
        if (res.status === "fail") throw res.message;
      })
      .catch((error) => {
        setErrors(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link to={"/"} className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Matrix's
            </span>
            Blog
          </Link>
          <p className="text-lg mt-5">
            This a demo project you can sign in with your email and password or
            with Google,
          </p>
        </div>
        {/* Client */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="username@domin.com"
                className=""
                id="email"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Password"
                className=""
                id="password"
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {erorrs && (
            <Alert className="mt-5" color={"failure"}>
              <div>
                <h4 className="text-xl">{erorrs}</h4>
              </div>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SginIn;
