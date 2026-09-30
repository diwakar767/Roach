const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const notificationRoute = require("./routes/notificationRoute");
const stockRoute = require("./routes/stockRoute");
const reportRoute = require("./routes/reportRoute");
const adminRoute = require("./routes/adminRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");
const seedAdmin = require("./utils/seedAdmin");

const app = express();

//Middlewares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:8080",
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes Middleware

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/stock", stockRoute);
app.use("/api/reports", reportRoute);
app.use("/api/admin", adminRoute);

//Routes

app.get("/", (req, res) => {
    res.send("Home Page");
});

//Error Middleware

app.use(errorHandler);

//connect to Db and start server

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(async () => {
    await seedAdmin();
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
})
.catch((err) => console.log(err));
