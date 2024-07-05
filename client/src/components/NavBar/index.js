import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./index.css";

const NavBar = () => {
  const history = useHistory();
  const signInHandler = () => {
    history.push("/signin");
  };
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <h2 className="logo-name">DMC</h2>
      </Link>
      <button onClick={signInHandler} className="signin-button">
        Sign In
      </button>
    </header>
  );
};
export default NavBar;
