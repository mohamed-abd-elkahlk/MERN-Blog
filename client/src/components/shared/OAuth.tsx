import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase.config";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../../redux/slices/user";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";

const OAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const GoogleOAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const resFromGoogle = await signInWithPopup(auth, provider);
    await dispatch(googleAuth(resFromGoogle))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.ok) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Button
      type="button"
      gradientDuoTone={"pinkToOrange"}
      outline
      onClick={GoogleOAuth}
    >
      <AiFillGoogleCircle className="h-6 w-6 mx-3" />
      <span>Continue with google</span>
    </Button>
  );
};

export default OAuth;
