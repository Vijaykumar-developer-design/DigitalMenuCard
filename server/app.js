const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

// Increase payload size limits
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "img-src": [
          "'self'",
          "data:",
          "https://digital-menu-card-server.vercel.app/api",
        ], // Allow image source
        "connect-src": [
          "'self'",
          "https://create-your-digital-menu-card.vercel.app",
        ], // Allow API calls
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Additional security headers
    hsts: true,
    xssFilter: true,
    noSniff: true,
    frameguard: { action: "deny" },
  })
);

// app.use(
//   cors({
//     origin: "https://create-your-digital-menu-card.vercel.app/signin",
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );
const corsOptions = {
  origin: "https://create-your-digital-menu-card.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Requested-With", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://create-your-digital-menu-card.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.options("*", cors(corsOptions)); // preflight OPTIONS request
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;
const uri = process.env.DATABSE_ADDRESS;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
//used for static for serving
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const signUpHandler = require("./handlers/signUpHandler");
const signInHandler = require("./handlers/signInHandler");
const forgotPasswordHandler = require("./handlers/forgotPasswordHandler");
const checkUserEmailHandler = require("./handlers/checkUserEmailHandler");
const getDataHandler = require("./handlers/getDataHandler");
const menuItemHandler = require("./handlers/menuItemHandler");
const verifyAuthorization = require("./middlewares/authMiddleware");
const { postImageUpload } = require("./middlewares/multerConfig");
const getMenuItemsHandler = require("./handlers/getMenuItemsHandler");
const deleteItemHandler = require("./handlers/deleteItemHandler");
const receiveOrdersHandler = require("./handlers/receiveOrdersHandler");
const getOrdersHandler = require("./handlers/getOrdersHandler");
const removeOrderHandler = require("./handlers/removeOrderHandler");
const markOrderCompleted = require("./handlers/markOrderCompleted");
app.get("/api/home/:userId", getDataHandler);
app.post("/api/signup", signUpHandler);
app.post("/api/signin", signInHandler);
app.post("/api/forgot", forgotPasswordHandler);
app.post("/api/home/generateqr", checkUserEmailHandler);
app.post;
app.post(
  "/api/add-item",
  verifyAuthorization,
  postImageUpload.single("file"),
  menuItemHandler
);

app.get("/api/owner/:userId", verifyAuthorization, getMenuItemsHandler);
app.delete("/api/owner/:id", deleteItemHandler);
app.post("/api/placeorder", receiveOrdersHandler);
app.get("/api/getorders/:userId", verifyAuthorization, getOrdersHandler);
app.delete("/api/removeorder", removeOrderHandler);
app.post("/api/markordercompleted", verifyAuthorization, markOrderCompleted);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// we are exporting only server because server is crated using app on the above
module.exports = app;
