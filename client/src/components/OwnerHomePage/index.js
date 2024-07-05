import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { UpdateSetHomePageActive } from "../../actions/userActions";
import SignInPage from "../SignInPage";
import MenuItemManager from "../MenuItemManager";
import OrderManager from "../OrderManager";
import Cookies from "js-cookie";
import "./index.css";
const OwnerHomePage = () => {
  const [view, setView] = useState("menu");
  const { userId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const homeAciveStatus = useSelector((state) => state.home.homeActive);
  const handleLogout = () => {
    dispatch(UpdateSetHomePageActive(false));
    localStorage.clear();
    Cookies.remove("jwt_token");
    history.replace(`/home/${userId}`);
  };
  // console.log(userId);
  if (homeAciveStatus === false) {
    return <SignInPage />;
  }
  return (
    <div className="app-container">
      <div className="button-group">
        <button
          className={view === "menu" ? "active" : "inactive"}
          onClick={() => setView("menu")}
        >
          Menu Items
        </button>
        <button
          className={view === "orders" ? "active" : "inactive"}
          onClick={() => setView("orders")}
        >
          Orders
        </button>
        <button className="orders-menu-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {view === "menu" ? <MenuItemManager /> : <OrderManager />}
    </div>
  );
};
export default OwnerHomePage;
