import { legacy_createStore as createStore, combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import homeActiveReducer from "./reducers/homeActiveReducer";
const rootReducer = combineReducers({
  user: userReducer,
  home: homeActiveReducer,
});

const store = createStore(rootReducer);

export default store;
