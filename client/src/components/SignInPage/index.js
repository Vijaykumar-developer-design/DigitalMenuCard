import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUserId } from "../../actions/userActions";
import { BiSolidHide, BiShow } from "react-icons/bi";
import { ApiUrl } from "../Api/api";
import { useSelector } from "react-redux";
import NavBar from "../NavBar";
import "./index.css";
const SignInPage = () => {
  const homeAciveStatus = useSelector((state) => state.home.homeActive);
  // console.log("homeAciveStatus=>", homeAciveStatus);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  // console.log(homeAciveStatus);
  const redirectToHome = (data) => {
    // saving token for authentication
    Cookies.set("jwt_token", data.jwt_token, { expires: 10 });

    dispatch(setUserId(data.userId));
    // console.log("props==>", homeAciveStatus);
    if (homeAciveStatus === true) {
      history.push(`/owner/${data.userId}`);
    } else {
      history.replace("/home/generateqr");
    }
    // dispatch(setUserProfile(data.userProfile));
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };
  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePath = () => {
    history.replace("/signup");
  };
  const changeForgot = () => {
    history.replace("/forgot");
  };

  const submitForm = (e) => {
    e.preventDefault();
    const userDetails = { email: email.trim(), password };

    // console.log(userDetails, "details");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const url = `${ApiUrl}/signin`;
    const fetchData = async () => {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data, "==>data");
      // console.log(data.jwt_token, "=> token");
      try {
        // console.log("<==>", response);
        if (response.ok) {
          redirectToHome(data);
          // console.log("userId==>", data.userId);
        } else {
          // console.log(data.error);
          setError(data.error);
          // console.log(data); setError(data.error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (email.trim().endsWith("@gmail.com")) {
      if (password.length < 4) {
        setError("Password length must be atleast 4 characters");
      } else {
        fetchData();
      }
    } else {
      setError("Enter valid email address");
    }
  };

  return (
    <div className="sign-in-success-bg">
      <div className="signin-nav">
        <NavBar />
      </div>
      <form name="signinform" onSubmit={submitForm} className="form-success">
        <div className="input-containers">
          <label className="form-success-label" htmlFor="name">
            User email address
          </label>
          <input
            required
            value={email}
            onChange={updateEmail}
            placeholder="Enter email address...."
            className="form-success-input"
            type="text"
            id="name"
          />
        </div>
        <div className="input-containers">
          <label className="form-success-label" htmlFor="password">
            User Password
          </label>
          <input
            autoComplete="true"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={updatePassword}
            placeholder="Enter your password...."
            className="form-success-input"
            id="password"
          />
        </div>
        <div>
          {showPassword ? (
            <div className="password-show-parent-signin">
              <BiShow
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon-signin"
              />
              <span>Hide Password</span>
            </div>
          ) : (
            <div className="password-show-parent-signin">
              <BiSolidHide
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon-signin"
              />
              <span>Show Password</span>
            </div>
          )}
        </div>
        <button className="sign-in-button" type="submit">
          Sign In
        </button>
        <p>
          Don’t have an account ?{" "}
          <span onClick={changePath} className="sign-up">
            Sign Up
          </span>
        </p>
        <p onClick={changeForgot} className="forgot-text">
          Forgot password ?
        </p>
        <p className="signin-error">{error}</p>
      </form>
    </div>
  );
};
export default SignInPage;
