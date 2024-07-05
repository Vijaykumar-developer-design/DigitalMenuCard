import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BiSolidHide, BiShow } from "react-icons/bi";
import { ApiUrl } from "../Api/api";
import NavBar from "../NavBar";
import "./index.css";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const updateEmail = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };
  const updatePassword = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };
  const updateHotelName = (e) => {
    setFormData({ ...formData, hotelName: e.target.value });
  };

  const changePath = () => {
    history.replace("/signin");
  };

  const submitForm = (e) => {
    e.preventDefault();
    const { hotelName, email, password } = formData;

    const userDetails = {
      userId: uuidv4(),
      email: email.trim(),
      password,
      hotelName: hotelName.trim(),
    };

    // console.log("details", userDetails);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const url = `${ApiUrl}/signup`;
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log("<==>", response);
        if (!response.ok) {
          setError(data.error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          changePath();
          // console.log(data);
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
  const { hotelName, email, password } = formData;
  return (
    <div className="sign-up-success-bg">
      <div className="signup-nav">
        <NavBar />
      </div>
      <form onSubmit={submitForm} className="form-success-up">
        <div className="input-containers-up">
          <label className="form-success-label-up" htmlFor="mobileup">
            User Hotel Name
          </label>
          <input
            required
            value={hotelName}
            onChange={updateHotelName}
            placeholder="Enter Hotel Name...."
            className="form-success-input-up"
            type="text"
            id="hotelname"
            autoComplete="hotelname"
            name="hotelName"
          />
        </div>
        <div className="input-containers-up">
          <label className="form-success-label-up" htmlFor="mobileup">
            User email address
          </label>
          <input
            required
            value={email}
            onChange={updateEmail}
            placeholder="Enter email address...."
            className="form-success-input-up"
            type="text"
            id="email"
            autoComplete="email"
          />
        </div>

        <div className="input-containers-up">
          <label className="form-success-label-up" htmlFor="passwordup">
            Set Password
          </label>
          <input
            required
            onChange={updatePassword}
            value={password}
            placeholder="Enter password...."
            className="form-success-input-up"
            type={showPassword ? "text" : "password"}
            id="passwordup"
            autoComplete="current-password"
          />
        </div>

        {showPassword ? (
          <div className="password-show-parent">
            <BiShow
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon"
            />
            <span>Hide Password</span>
          </div>
        ) : (
          <div className="password-show-parent">
            <BiSolidHide
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon"
            />
            <span>Show Password</span>
          </div>
        )}

        <button className="sign-up-button" type="submit">
          Sign Up
        </button>
        <p>
          Alreday have an account ?{" "}
          <span onClick={changePath} className="sign-up">
            Sign In
          </span>
        </p>
        <p className="signup-error">{error}</p>
      </form>
    </div>
  );
};
export default SignUpPage;
