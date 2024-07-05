import { Redirect, BrowserRouter, Switch, Route } from "react-router-dom";
import QRCodeAuthentication from "./components/HomePage";
import MenuCard from "./components/MenuHome";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import ForgotPage from "./components/ForgotPage";
import OwnerHomePage from "./components/OwnerHomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import store from "./store";
import { Provider } from "react-redux";
import "./App.css";
import LandingPage from "./components/LandingPage";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/forgot" component={ForgotPage} />
          <ProtectedRoute
            exact
            path="/home/generateqr"
            component={QRCodeAuthentication}
          />
          <Route exact path="/home/:userId" component={MenuCard} />
          <ProtectedRoute
            exact
            path="/owner/:userId"
            component={OwnerHomePage}
          />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
