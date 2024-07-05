export const setUserId = (userId) => {
  localStorage.setItem("userId", userId);
  return {
    type: "LOGIN_SUCCESS",
    payload: userId,
  };
};
export const setHomePageActive = (activeStatus) => {
  localStorage.setItem("homeActive", activeStatus);
  return {
    type: "HOME_ACTIVE",
    payload: activeStatus,
  };
};
export const UpdateSetHomePageActive = (activeStatus) => {
  localStorage.setItem("homeActive", activeStatus);
  return {
    type: "UPDATE_HOME_ACTIVE",
    payload: activeStatus,
  };
};
