const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const billRoutes = require("./routes/bill");
const dashboardRoutes = require("./routes/dashboard");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/bill", billRoutes);
app.use("/dashboard", dashboardRoutes);

module.exports = app;
