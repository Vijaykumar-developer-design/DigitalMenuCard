import React, { useState, useRef, useCallback, useEffect } from "react";
import { ApiUrl } from "../Api/api";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import FadeLoader from "react-spinners/FadeLoader";
import Resizer from "react-image-file-resizer"; // Correct import statement
import "./index.css";

const apiStatus = {
  initial: "INITIAL",
  pending: "IN_PROCESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const MenuItemManager = () => {
  const [apiState, setApiState] = useState(apiStatus.initial);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const effectRan = useRef(false);
  const { userId } = useParams();
  const jwt_token = Cookies.get("jwt_token");
  const fileInputRef = useRef(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isRemovingItem, setRemovingItem] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Resize the image before setting state
      resizeImage(file);
    }
  };

  const resizeImage = (file) => {
    try {
      const maxSizeMB = 4; // Maximum target size in MB
      const maxWidthOrHeight = 2048; // Maximum width or height for resizing

      Resizer.imageFileResizer(
        file,
        maxWidthOrHeight,
        maxWidthOrHeight,
        "JPEG",
        maxSizeMB * 1024 * 1024, // Convert MB to bytes
        0,
        (resizedFile) => {
          if (!resizedFile.name || resizedFile.name === "blob") {
            const renamedFile = new File([resizedFile], file.name, {
              type: resizedFile.type,
            });
            setImage(renamedFile);
          } else {
            setImage(resizedFile);
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(resizedFile);
        },
        "blob"
      );
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  const getItemsListApi = useCallback(async () => {
    setApiState(apiStatus.pending);
    try {
      const url = `${ApiUrl}/owner/${userId}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        const listItems = data.itemsList;
        setItems(listItems);
        setApiState(apiStatus.success);
      } else {
        setApiState(apiStatus.failure);
        console.log("Error while fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  }, [jwt_token, userId]);

  useEffect(() => {
    if (!effectRan.current) {
      getItemsListApi(); // Fetch data only on the first mount
    }
    return () => {
      effectRan.current = true;
    };
    // effectRan.current = true;
  }, [getItemsListApi]);

  const handleAddItem = async () => {
    if (name && price && file) {
      setIsAddingItem(true);
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("price", price.toString().trim());
      formDataToSend.append("name", name.trim());
      formDataToSend.append("userId", userId);
      // console.log("file=>", file);
      // for (const entry of formDataToSend.entries()) {
      //   console.log("FormData entry:", entry);
      // }
      const url = `${ApiUrl}/add-item`;
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
        body: formDataToSend,
      };
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          await getItemsListApi();
          setName("");
          setPrice("");
          setImage(null);
          setImagePreview(null);
          fileInputRef.current.value = "";
        } else {
          console.error("Failed to add item");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsAddingItem(false); // Reset loading state after the request completes
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleRemoveItem = async (id) => {
    setRemovingItem(true);
    try {
      const jwt_token = Cookies.get("jwt_token");
      const url = `${ApiUrl}/owner/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        await getItemsListApi();
      } else {
        throw new Error(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error while deleting post:", error);
      throw error;
    } finally {
      setRemovingItem(false); // Reset loading state after the request completes
    }
  };

  const renderLoader = () => (
    <div className="loader-container-menu">
      <p>Loading data ...</p>
      <FadeLoader color="#36d7b7" />
    </div>
  );

  const failureView = () => (
    <div className="failure-parent-menu">
      <h1>Getting Error while fetching data....</h1>
      <p className="failure-msg">Please try again later.</p>
    </div>
  );

  const renderPosts = () => {
    return (
      <div className="item-list">
        {items.length < 1 ? (
          <h1 className="empty-menu">Please add your Menu items to show...</h1>
        ) : (
          <>
            {items.map((item, index) => (
              <div key={index} className="menu-item">
                <img
                  src={item.uploadImage}
                  alt={item.name}
                  className="item-image"
                  loading="lazy"
                />
                <div className="item-details">
                  <h2>{item.name}</h2>
                  <p className="menu-item-price">&#8377;{item.price}</p>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  {isRemovingItem ? "Removing Item..." : "Remove Item"}
                </button>
              </div>
            ))}
          </>
        )}
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
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value > 0) {
      setPrice(value);
    }
  };
  return (
    <div className="menu-item-manager">
      <div className="input-group">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={handlePriceChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}
        <button disabled={!file} onClick={handleAddItem}>
          {isAddingItem ? "Please wait..." : "Add Item"}
        </button>
      </div>
      {renderComponents()}
    </div>
  );
};

export default MenuItemManager;
