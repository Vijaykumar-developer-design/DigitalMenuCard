const initialState = {
  homeActive: localStorage.getItem("homeActive") || false,
};

const homeActiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case "HOME_ACTIVE":
      localStorage.setItem("homeActive", action.payload);
      return {
        ...state,
        homeActive: action.payload,
      };
    case "UPDATE_HOME_ACTIVE":
      localStorage.setItem("homeActive", action.payload);
      return {
        ...state,
        homeActive: action.payload,
      };
    default:
      return state;
  }
};

export default homeActiveReducer;
