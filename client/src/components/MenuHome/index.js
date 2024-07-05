import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { setHomePageActive } from "../../actions/userActions";
import { useDispatch } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import "./index.css";
import { ApiUrl } from "../Api/api";

const apiStatus = {
  initial: "INITIAL",
  pending: "IN_PROCESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const MenuCard = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showTableError, setShowTableError] = useState(false);
  const [menuItemError, setMenuItemError] = useState(false);
  const [apiState, setApiState] = useState(apiStatus.initial);
  const [items, setItems] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [quantities, setQuantities] = useState({});
  const [tableNumber, setTableNumber] = useState("");
  const { userId } = useParams();
  const history = useHistory();
  const effectRan = useRef(false);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    setApiState(apiStatus.pending);
    try {
      const url = `${ApiUrl}/home/${userId}`;
      const options = { method: "GET" };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        setHotelName(data.hotel);
        setItems(data.menuList);
        setQuantities(
          data.menuList.reduce((acc, item) => {
            acc[item._id] = 0;
            return acc;
          }, {})
        );
        setApiState(apiStatus.success);
      } else {
        console.log("Error while fetching data");
        setApiState(apiStatus.failure);
      }
    } catch (error) {
      console.log(error);
      setApiState(apiStatus.failure);
    }
  }, [userId]);

  useEffect(() => {
    if (!effectRan.current) {
      fetchData();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchData]);

  const handleOwnerLogin = () => {
    dispatch(setHomePageActive(true));
    history.push("/signin");
  };

  const handleIncrement = (_id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [_id]: (prevQuantities[_id] || 0) + 1,
    }));
  };

  const handleDecrement = (_id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [_id]: Math.max((prevQuantities[_id] || 0) - 1, 0),
    }));
  };

  const handlePlaceOrder = async () => {
    if (!tableNumber.trim()) {
      setShowTableError(true); // Show success message
      setTimeout(() => setShowTableError(false), 3000);
      return;
    }

    const orderDetails = items
      .filter((item) => quantities[item._id] > 0)
      .map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: quantities[item._id],
      }));
    const totalBill = orderDetails.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const orderData = {
      userId: userId,
      items: orderDetails,
      note: additionalDetails,
      tableNumber: tableNumber.trim(),
      orderedTime: new Date().toISOString(),
      totalBill: totalBill.toFixed(2),
    };
    if (orderDetails.length === 0) {
      setMenuItemError(true); // Show success message
      setTimeout(() => setMenuItemError(false), 3000);
      return;
    }
    // console.log(orderData);
    try {
      const response = await fetch(`${ApiUrl}/placeorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setShowSuccessMessage(true); // Show success message
        setTimeout(() => setShowSuccessMessage(false), 3000);
        // Reset all item quantities to 0
        setQuantities({});
        setTableNumber("");
        setAdditionalDetails("");
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order.");
    }
  };

  const renderLoader = () => (
    <div className="loader-container">
      <p>Loading data...</p>
      <TailSpin width={50} height={50} color="blue" />
    </div>
  );

  const failureView = () => (
    <div className="failure-parent">
      <h1>Getting Error while fetching data....</h1>
      <p className="failure-msg">Please try after sometime...</p>
    </div>
  );
  const handleTableNumber = (e) => {
    const value = e.target.value;
    if (value > 0) {
      setTableNumber(value);
    }
  };
  const renderPosts = () => {
    return (
      <div className="menu-card-menu">
        {items.length < 1 ? (
          <h1>Menu card is empty...</h1>
        ) : (
          <>
            {items.map((item) => (
              <div key={item._id} className="menu-item-menu">
                <img
                  src={item.uploadImage}
                  alt={item.name}
                  className="item-image"
                  loading="lazy"
                />
                <div className="item-details">
                  <h2>{item.name}</h2>
                  <p className="menu-card-item-price">
                    &#8377; {parseInt(item.price).toFixed(2)}
                  </p>
                </div>
                <div className="quantity-control">
                  <button onClick={() => handleDecrement(item._id)}>-</button>
                  <span>{quantities[item._id] || 0}</span>
                  <button onClick={() => handleIncrement(item._id)}>+</button>
                </div>
              </div>
            ))}
          </>
        )}
        <textarea
          placeholder="Additional details"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          className="additional-details"
        />
        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={handleTableNumber}
          className="table-number-input"
        />
        <button
          disabled={items.length === 0}
          className="place-order-btn"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
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
        return null;
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-center">{hotelName ? hotelName : "Hotel"}</div>
        <div className="navbar-right">
          <button onClick={handleOwnerLogin} className="owner-login-btn">
            Owner Login
          </button>
        </div>
      </nav>
      <div className="menu-card-parent">
        {renderComponents()}
        {showSuccessMessage && (
          <div className="success-message">
            <p>Your order was placed successfully!</p>
            <button onClick={() => setShowSuccessMessage(false)}>Close</button>
          </div>
        )}
        {showTableError && (
          <div className="table-message">
            <p>Please enter table number!</p>
            <button onClick={() => setShowTableError(false)}>Close</button>
          </div>
        )}
        {menuItemError && (
          <div className="menu-message">
            <p>Please select at least one item to order!</p>
            <button onClick={() => setMenuItemError(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
