import React, { useState } from "react";
import QRCode from "qrcode.react";
import QrReader from "react-qr-scanner";
import { ApiUrl, clientUrl } from "../Api/api";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

function QRCodeAuthentication() {
  const history = useHistory();
  const [email, setGmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [qrGenerated, setQRGenerated] = useState(false);
  const [showError, setShowError] = useState("");
  const userId = useSelector((state) => state.user.userId);

  const checkRegisterEmailAddress = async () => {
    const sentEmail = { email: email.trim() };
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sentEmail),
      };
      const url = `${ApiUrl}/home/generateqr`;
      const response = await fetch(url, options);
      const data = await response.json();
      if (data.msg === "success") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error while fetching data", error);
      return false;
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("jwt_token");
    history.replace("/signin");
  };

  const handleGenerateQR = async () => {
    const condition = email.trim().endsWith("@gmail.com");
    if (condition) {
      const userExists = await checkRegisterEmailAddress();
      if (userExists) {
        setRedirectUrl(`${clientUrl}/home/${userId}`);
        setQRGenerated(true);
        setShowError("");
      } else {
        setShowError("Please Enter your registered gmail address");
        setQRGenerated(false); // Hide the QR code
      }
    } else {
      setShowError("Enter a valid gmail address");
      setQRGenerated(false); // Hide the QR code
    }
  };

  // here we are getting scan data and redirecting to the scanned url
  // const handleScan = (data) => {
  //   if (data) {
  //     if (data === redirectUrl) {
  //       window.location.href = data;
  //     }
  //   }
  // };

  // const handleError = (err) => {
  // console.error(err);
  // if (err.name === "NotAllowedError") {
  //   setShowError(
  //     "Camera access was denied. Please allow camera access to scan QR codes."
  //   );
  // } else if (err.name === "NotFoundError") {
  //   setShowError("No camera found. Please ensure a camera is connected.");
  // } else {
  //   setShowError("An unknown error occurred while accessing the camera.");
  // }
  // };

  const downloadQRCode = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = url;
      link.click();
      setRedirectUrl("");
    }
  };

  return (
    <div className="menu-homepage-bg">
      <h4 className="heading">Generate Your QR Code For Your Menu Card</h4>
      <div className="qr-user-container">
        <div className="input-container">
          <div className="input-parent-home">
            <label className="gmail-label" htmlFor="gmail">
              Enter Gmail Address :
            </label>
            <input
              type="text"
              id="gmail"
              value={email}
              onChange={(e) => setGmail(e.target.value)}
              placeholder="Please Enter your gmail.."
              className="input-taker"
            />
          </div>
          <button className="generate-btn" onClick={handleGenerateQR}>
            Generate QR
          </button>

          <p className="logout-text">
            Please logout after downloading you QR Code
          </p>
          <button
            className="logout-qr-btn"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
          {showError !== "" ? <p className="error"> * {showError}</p> : ""}
        </div>

        <div className="qr-parent">
          {qrGenerated && redirectUrl ? (
            <div className="qr-child">
              <QRCode value={redirectUrl} size={200} />
              <p className="qr-generated-text-p">QR generated for :</p>
              <p className="qr-generated-text"> {email}</p>
              <button className="download-qr-btn" onClick={downloadQRCode}>
                Download QR Code
              </button>
            </div>
          ) : (
            <div className="qr-none-text">Your QR will display here...</div>
          )}
        </div>
        <br />
        <div className="scanqr">
          {/* It is responsible for rendering a camera view for scanning QR codes. */}
          {/* <QrReader
            onScan={handleScan}
            onError={handleError}
            style={{ width: "100%" }}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default QRCodeAuthentication;

//2
// import React, { useState } from "react";
// import QRCode from "qrcode.react";
// import QrReader from "react-qr-scanner";
// import CryptoJS from "crypto-js";
// import { ApiUrl } from "../Api/api";
// import "./index.css";
// function QRCodeAuthentication() {
//   const [email, setGmail] = useState("");
//   const [redirectUrl, setRedirectUrl] = useState("");
//   const [qrGenerated, setQRGenerated] = useState(false);
//   const [showError, setShowError] = useState("");
//   const [userExisted, setUserExisted] = useState(false);
//   const encryptEmail = (email, secretKey) => {
//     // Encrypt email using AES encryption
//     const encryptedEmail = CryptoJS.AES.encrypt(email, secretKey).toString();
//     return encryptedEmail;
//   };
//   const checkRegisterEmailAddress = async () => {
//     const sentEmail = { email: email.trim() };
//     try {
//       const options = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(sentEmail),
//       };
//       const url = `${ApiUrl}/home/generateqr`;
//       const response = await fetch(url, options);
//       const data = await response.json();
//       if (data.msg === "success") {
//         console.log(data);
//         setUserExisted(true);
//         return data.msg;
//       } else {
//         setUserExisted(false);
//         setShowError("Please Enter your registered gmail address");
//       }
//     } catch (error) {
//       console.log("Error while fetchning data", error);
//     }
//   };
//   const handleGenerateQR = async () => {
//     // Encode the Gmail address into the QR code
//     const condition = email.trim().endsWith("@gmail.com");
//     if (condition) {
//       const value = await checkRegisterEmailAddress();
//       if (value === "success" && userExisted) {
//         const secretKey = "MY_SECRET_KEY";
//         const encryptedEmail = encryptEmail(email, secretKey);
//         const encryptedGmail = encryptedEmail.toString();
//         // const decodedData = decodeURIComponent(encodedGmail);
//         // console.log(decodedData);
//         setRedirectUrl(`${ApiUrl}/home/${encryptedGmail}`);
//         setQRGenerated(true); // Set QR code generated flag
//         setShowError("");
//       } else {
//         setShowError("Please Enter your registered gmail address");
//       }
//     } else {
//       setShowError("Enter a valid gmail address");
//     }
//   };

//   const handleScan = (data) => {
//     if (data) {
//       // const decodedData = decodeURIComponent(data);
//       // console.log(decodedData, "data");
//       // Check if the scanned data matches the redirect URL
//       if (data === redirectUrl) {
//         window.location.href = data;
//       }
//       // setScannedGmail(decodedData);
//     }
//   };

//   const handleError = (err) => {
//     // console.error(err);
//   };

//   const downloadQRCode = () => {
//     // Get the QR code canvas element
//     const canvas = document.querySelector("canvas");
//     if (canvas) {
//       const url = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.download = "qrcode.png";
//       link.href = url;
//       link.click();
//       setRedirectUrl("");
//     }
//   };

//   return (
//     <div className="menu-homepage-bg">
//       <h4 className="heading">Generate Your QR Code For Your Menu Card</h4>

//       <div className="input-container">
//         <div className="input-parent-home">
//           <label className="gmail-label" htmlFor="gmail">
//             Enter Gmail Address :
//           </label>
//           <input
//             type="text"
//             id="gmail"
//             value={email}
//             onChange={(e) => setGmail(e.target.value)}
//             placeholder="Please Enter your gmail.."
//             className="input-taker"
//           />
//         </div>
//         <button className="generate-btn" onClick={handleGenerateQR}>
//           Generate QR
//         </button>
//         {showError !== "" ? <p className="error"> * {showError}</p> : ""}
//       </div>

//       <div className="qr-parent">
//         {redirectUrl && (
//           <div className="qr-child">
//             <QRCode value={redirectUrl} size={200} />
//             <p>QR generated for : {email}</p>
//             {qrGenerated && (
//               <button className="download-qr-btn" onClick={downloadQRCode}>
//                 Download QR Code
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//       <br />
//       <div className="scanqr">
//         {/* // it is responsible for rendering a camera view for scanning QR codes. */}
//         <QrReader
//           onScan={handleScan}
//           onError={handleError}
//           style={{ width: "100%" }}
//         />
//       </div>
//     </div>
//   );
// }

// export default QRCodeAuthentication;

//1
// import React, { useState } from "react";
// import QrReader from "react-qr-scanner";
// import QRCode from "qrcode.react";

// function QRCodeAuthentication() {
//   const [gmail, setGmail] = useState("");
//   const [scannedGmail, setScannedGmail] = useState("");
//   const [redirectUrl, setRedirectUrl] = useState("");
//   const [showError, setShowError] = useState("");

//   const handleGenerateQR = () => {
//     const condition = gmail.endsWith("@gmail.com");
//     if (condition) {
//       const encodedGmail = encodeURIComponent(gmail);
//       setRedirectUrl(`https://example.com/?gmail=${encodedGmail}`);
//       setGmail("");
//     } else {
//       setShowError("Enter a valid gmail address");
//     }
//     // Encode the Gmail address into the QR code
//   };

//   const handleScan = (data) => {
//     if (data) {
//       // Check if the scanned data matches the redirect URL
//       if (data === redirectUrl) {
//         window.location.href = data;
//       }
//       setScannedGmail(data);
//     }
//   };

//   const handleError = (err) => {
//     console.error(err);
//     setShowError("Please allow Camera Permissions To scan Qr");
//   };

//   return (
//     <div className="menu-homepage-bg">
//       <div>
//         <h1>Generate QR </h1>
//         <div>
//           <label htmlFor="gmail">Enter Gmail Address:</label>
//           <input
//             type="text"
//             id="gmail"
//             value={gmail}
//             onChange={(e) => setGmail(e.target.value)}
//           />
//           <button onClick={handleGenerateQR}>Generate QR</button>
//         </div>
//         <br />
//         <div>
//           {redirectUrl && (
//             <div>
//               <QRCode value={redirectUrl} />
//               <QrReader
//                 onScan={handleScan}
//                 onError={handleError}
//                 style={{ width: "100%" }}
//               />
//               {/* {scannedGmail && <p>Scanned Gmail Address: {scannedGmail}</p>} */}
//             </div>
//           )}
//         </div>
//         {showError && <p>{showError}</p>}
//       </div>
//     </div>
//   );
// }

// export default QRCodeAuthentication;

//2
// import React, { useState } from "react";
// import QRCode from "qrcode.react";
// import QrReader from "react-qr-scanner";

// function QRCodeAuthentication() {
//   const [gmail, setGmail] = useState("");
//   const [scannedGmail, setScannedGmail] = useState("");
//   const [redirectUrl, setRedirectUrl] = useState("");

//   const handleGenerateQR = () => {
//     // Encode the Gmail address into the QR code
//     const encodedGmail = encodeURIComponent(gmail);
//     setRedirectUrl(`https://example.com/?gmail=${encodedGmail}`);
//     setGmail("");
//   };

//   const handleScan = (data) => {
//     if (data) {
//       // Check if the scanned data matches the redirect URL
//       if (data === redirectUrl) {
//         window.location.href = data;
//       }
//       setScannedGmail(data);
//     }
//   };

//   const handleError = (err) => {
//     console.error(err);
//   };

//   return (
//     <div>
//       <h1>Gmail QR Code Authentication</h1>
//       <div>
//         <label htmlFor="gmail">Enter Gmail Address:</label>
//         <input
//           type="text"
//           id="gmail"
//           value={gmail}
//           onChange={(e) => setGmail(e.target.value)}
//         />
//         <button onClick={handleGenerateQR}>Generate QR</button>
//       </div>
//       <br />
//       <div>
//         <QRCode value={redirectUrl} />
//       </div>
//       <br />
//       <div>
//         <QrReader
//           onScan={handleScan}
//           onError={handleError}
//           style={{ width: "100%" }}
//         />
//         {scannedGmail && <p>Scanned Gmail Address: {scannedGmail}</p>}
//       </div>
//     </div>
//   );
// }

// export default QRCodeAuthentication;

//3
// import React, { useState } from "react";
// import QRCode from "qrcode.react";
// import QrReader from "react-qr-scanner";

// function QRCodeAuthentication() {
//   const [gmail, setGmail] = useState("");
//   const [scannedGmail, setScannedGmail] = useState("");
//   const [latestGmail, setLatestGmail] = useState("");

//   const handleGenerateQR = () => {
//     // Encode the Gmail address into the QR code
//     const encodedGmail = encodeURIComponent(gmail);
//     setLatestGmail(encodedGmail);
//     setGmail("");
//   };

//   const handleScan = (data) => {
//     if (data) {
//       // Check if the scanned data matches the latest Gmail address
//       const decodedData = decodeURIComponent(data);
//       if (decodedData === latestGmail) {
//         window.location.href = `https://example.com/?gmail=${latestGmail}`;
//       }
//       setScannedGmail(decodedData);
//     }
//   };

//   const handleError = (err) => {
//     console.error(err);
//   };

//   return (
//     <div>
//       <h1>Gmail QR Code Authentication</h1>
//       <div>
//         <label htmlFor="gmail">Enter Gmail Address:</label>
//         <input
//           type="text"
//           id="gmail"
//           value={gmail}
//           onChange={(e) => setGmail(e.target.value)}
//         />
//         <button onClick={handleGenerateQR}>Generate QR</button>
//       </div>
//       <br />
//       <div>
//         {latestGmail && (
//           <div>
//             <QRCode value={latestGmail} />
//             <p>Gmail Address: {decodeURIComponent(latestGmail)}</p>
//           </div>
//         )}
//       </div>
//       <br />
//       <div>
//         <QrReader
//           onScan={handleScan}
//           onError={handleError}
//           style={{ width: "100%" }}
//         />
//         {scannedGmail && <p>Scanned Gmail Address: {scannedGmail}</p>}
//       </div>
//     </div>
//   );
// }

// export default QRCodeAuthentication;
