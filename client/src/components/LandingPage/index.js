import { useHistory } from "react-router-dom";
import NavBar from "../NavBar";
import "./index.css";

const LandingPage = () => {
  const history = useHistory();
  const signUpHandler = () => {
    history.push("/signup");
  };
  return (
    <div className="landing-bg">
      <NavBar />
      <main className="main-section">
        <h1>
          <span className="highlight">Transform</span> your restaurant
          experience with a digital menu card
        </h1>
        <button onClick={signUpHandler} className="signup-button">
          Sign Up
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
