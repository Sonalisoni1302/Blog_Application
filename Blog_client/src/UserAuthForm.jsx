import React, { useContext } from "react";
import InputBox from "./component/InputBox";
import googleIcon from "../src/images/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "./common/pageAnimation";
import { useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "./common/session";
import { UserContext } from "./App";
import { authwithGoogle } from "./common/firebase";
// import { getAuth } from "firebase/auth";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  let {
    userAuth: { token },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);

        // Show a success message based on the type of action (signup or signin)
        if (serverRoute === "/user/signup") {
          toast.success("Successfully registered!");
        } else if (serverRoute === "/user/signin") {
          toast.success("Login successful!");
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
      });
  };

  const handleAuthGoogle = async (e) => {
    e.preventDefault();
    try {
      const user = await authwithGoogle();
      if (user) {
        const idToken = await user.getIdToken();
        let serverRoute = "/google-auth";
        let formData = {
          token : idToken,
        };
        await userAuthThroughServer(serverRoute, formData);
      }
    } catch (err) {
      // This catches any errors during the process and prevents pending promises
      toast.error("Trouble logging in with Google");
      console.error("Error during Google Authentication:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log(import.meta.env.VITE_SERVER_DOMAIN);

    let serverRoute = type === "sign-in" ? "/user/signin" : "/user/signup";

    // regex for email
    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    // regex for password
    // let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // formData
    let form = new FormData(authForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    // let { email, password } = formData;
     let { email} = formData;

    // FormValidation
    if (!emailRegex.test(email)) {
      return toast.error("Enter a valid email");
    }

    // if(!passwordRegex.test(password)){
    //     return toast.error("Password at least between 6 to 20 characters."
    //     )
    // }

    userAuthThroughServer(serverRoute, formData);

    // Clear the form after submission
    authForm.current.reset();
  };

  return token ? (
    <Navigate to="/" />
  ) : (
    <>
      <AnimationWrapper keyvalue={type}>
        <section className="h-cover flex items-center justify-center">
          <Toaster />
          <form ref={authForm} className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-16">
              {type === "sign-in" ? "Welcome Back" : "Join us today"}
            </h1>

            {type !== "sign-in" ? (
              <InputBox
                name="fullname"
                type="text"
                placeholder="fullname"
                icon="fi-rr-user"
              />
            ) : (
              ""
            )}

            <InputBox
              name="email"
              type="email"
              placeholder="Email"
              icon="fi-rr-envelope"
            />

            <InputBox
              name="password"
              type="password"
              placeholder="password"
              icon="fi-rr-key"
            />

            <button
              className="btn-dark center mt-14"
              type="submit"
              onClick={handleSubmit}
            >
              {type.replace("-", "")}
            </button>

            <div className="relative w-full flex items-center gap-2 my-10 capacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>or</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button
              className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
              onClick={handleAuthGoogle}
            >
              <img src={googleIcon} alt="goolIcon" className="w-5" />
              Continue with google
            </button>

            {type === "sign-in" ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account ?
                <Link
                  to="/user/signup"
                  className="underline text-black text-xl ml-1"
                >
                  Join us today
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey tect-xl text-center">
                Already a member ?
                <Link
                  to="/user/signin"
                  className="underline text-black text-xl ml-1"
                >
                  Sign in here.
                </Link>
              </p>
            )}
          </form>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default UserAuthForm;
