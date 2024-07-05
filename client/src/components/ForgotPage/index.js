import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BiSolidHide, BiShow } from "react-icons/bi";
import { ApiUrl } from "../Api/api";
import NavBar from "../NavBar";
import "./index.css";

const ForgotPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const redirectToSignIn = () => {
    history.replace("/signin");
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
    const url = `${ApiUrl}/forgot`;
    const fetchData = async () => {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data, "==>data");
      // console.log(data.jwt_token, "=> token");
      try {
        // console.log(response, "<==");
        if (!response.ok) {
          setError(data.error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          redirectToSignIn();
          // console.log(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    // checking whether an entered number is numeric or not

    if (email.trim().endsWith("@gmail.com")) {
      if (password.length < 4) {
        setError("Password length must be atleast 4 characters");
      } else {
        fetchData();
      }
    } else {
      setError("Enter valid gmail address");
    }
  };
  const updateEmail = (e) => {
    setEmail(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="sign-up-success-bg-forgot">
      <div className="forgot-nav">
        <NavBar />
      </div>
      <form onSubmit={submitForm} className="form-success-up-forgot">
        <div className="input-containers-up-forgot">
          <label
            className="form-success-label-up-forgot"
            htmlFor="mobileupforgot"
          >
            User email address
          </label>
          <input
            required
            value={email}
            onChange={updateEmail}
            placeholder="Enter email address...."
            className="form-success-input-up-forgot"
            type="text"
            id="emailupforgot"
          />
        </div>

        <div className="input-containers-up-forgot">
          <label
            className="form-success-label-up-forgot"
            htmlFor="passwordupforgot"
          >
            Enter new password
          </label>
          <input
            required
            onChange={updatePassword}
            value={password}
            placeholder="Enter new password...."
            className="form-success-input-up-forgot"
            type={showPassword ? "text" : "password"}
            id="passwordupforgot"
          />
        </div>
        {showPassword ? (
          <div className="password-show-parent-forgot">
            <BiShow
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon-forgot"
            />
            <span>Hide Password</span>
          </div>
        ) : (
          <div className="password-show-parent-forgot">
            <BiSolidHide
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon-forgot"
            />
            <span>Show Password</span>
          </div>
        )}
        {error && <p className="forgot-error">{error}</p>}
        <button className="sign-button-forgot" type="submit">
          Reset Password
        </button>
        <p>
          Go to SignIn ?{" "}
          <span onClick={redirectToSignIn} className="forgot-signin">
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};
export default ForgotPage;
