require("dotenv").config();
const express = require("express");
const router = express.Router();
const connection = require("../conn");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");
router.post(
  "/add",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const category = req.body;
    const query = "insert into category  (name) value(?)";
    connection.query(query, [category.name], (err, results) => {
      if (!err) {
        return res
          .status(200)
          .json({ message: "Category addded successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
router.get("/get", auth.authenticateToken, (req, res, next) => {
  const query = "select * from category order by name";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let product = req.body;
    const query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Category Id was not found" });
        }
        return res
          .status(200)
          .json({ message: "Category updated successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
module.exports = router;
