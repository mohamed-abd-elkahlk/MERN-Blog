import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase.config";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const GoogleOAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resFromGoogle.user.displayName,
          email: resFromGoogle.user.email,
          imageUrl: resFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.ok === true) {
        console.log(data);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
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
