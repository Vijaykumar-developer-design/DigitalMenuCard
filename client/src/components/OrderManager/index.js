import React, { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import { ApiUrl } from "../Api/api"; // Adjust the import path as needed
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
const apiStatus = {
  initial: "INITIAL",
  pending: "IN_PROCESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const OrderManager = () => {
  const effectRan = useRef(false);
  const [apiState, setApiState] = useState(apiStatus.initial);
  const [orders, setOrders] = useState([]);
  const jwt_token = Cookies.get("jwt_token");
  const userId = useSelector((state) => state.user.userId);
  const fetchOrders = useCallback(async () => {
    setApiState(apiStatus.pending);
    try {
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json", // Adjust content type if needed
        },
      };
      const response = await fetch(`${ApiUrl}/getorders/${userId}`, options);
      const data = await response.json();
      if (response.ok) {
        // console.log("orders=>", data);
        setOrders(data.orders);
        setApiState(apiStatus.success);
      } else {
        setApiState(apiStatus.failure);
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [jwt_token, userId]);

  useEffect(() => {
    if (!effectRan.current) {
      // console.log("Effect applied - only on the FIRST mount");
      fetchOrders(); // Fetch data only on the first mount
      effectRan.current = true;
    }
    // fetching orders for every five seconds
    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  const markAsCompleted = async (orderId) => {
    try {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json", // Adjust content type if needed
        },
        body: JSON.stringify({ userId, orderId }),
      };
      const response = await fetch(`${ApiUrl}/markordercompleted`, options);
      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, completed: true } : order
          )
        );
      } else {
        console.error("Failed to mark order as completed");
      }
    } catch (error) {
      console.error("Error marking order as completed:", error);
    }
  };

  const removeOrder = async (orderId) => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Adjust content type if needed
        },
        body: JSON.stringify({ userId, orderId }),
      };

      const response = await fetch(`${ApiUrl}/removeorder`, options);
      // const data = await response.json();
      // console.log(data);
      if (response.ok) {
        await fetchOrders();
      } else {
        console.error("Failed to remove order");
      }
    } catch (error) {
      console.error("Error removing order:", error);
    }
  };

  // if (loading) {
  //   return <div className="Loading">Loading orders...</div>;
  // }
  const renderLoader = () => (
    <div className="loader-container-menu">
      <p>Loading data ...</p>
      <FadeLoader color="#36d7b7" />
    </div>
  );
  const failureView = () => (
    <div className="failure-parent-menu">
      <h1>Gettigng Error while fetching data....</h1>
      <p className="failure-msg">Please try after sometime...</p>
    </div>
  );
  const renderPosts = () => {
    return (
      <>
        {orders.length > 0 ? (
          <>
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <h3
                  className={order.completed === true ? "completed-text" : ""}
                >
                  Table No : {order.tableNumber}
                </h3>
                <ul
                  className={order.completed === true ? "completed-text" : ""}
                >
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className={order.completed === true ? "completed-text" : ""}>
                  Note: {order.note}
                </p>

                <p
                  className={
                    order.completed === true ? "completed-text" : "totalBill"
                  }
                >
                  Total Bill: {order.totalBill}
                </p>
                <div className="order-buttons-container">
                  <button
                    className="completed-btn"
                    onClick={() => markAsCompleted(order._id)}
                    disabled={order.completed}
                  >
                    {order.completed ? "Completed" : "Mark as Completed"}
                  </button>
                  <button
                    className="remove-order-btn"
                    onClick={() => removeOrder(order._id)}
                  >
                    Remove Order
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <h1 className="no-orders-text">No Orders were placed...</h1>
        )}
      </>
    );
  };
  const renderComponents = () => {
    switch (apiState) {
      case apiStatus.pending:
        return renderLoader();
      case apiStatus.failure:
        return failureView();
      case apiStatus.success:
        return renderPosts();
      default:
        return;
    }
  };
  return <div className="order-manager">{renderComponents()}</div>;
};

export default OrderManager;
