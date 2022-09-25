require("dotenv").config();
const express = require("express");
const router = express.Router();
const connection = require("../conn");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");
router.post("/signup", (req, res) => {
  let user = req.body;
  query = "select email,password,role,status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
        connection.query(
          query,
          [user.name, user.contactNumber, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res.status(200).json({ message: "Insert Successful" });
            } else {
              return res.status(500).json({ message: err });
            }
          }
        );
      } else {
        return res.status(500).json({ message: "Insert failed" });
      }
    } else {
      return res.status(500).json({ message: "Email already exists" });
    }
  });
});
router.post("/login", (req, res) => {
  const user = req.body;
  query = "select email,password,role,status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password !== user.password) {
        return res
          .status(401)
          .json({ message: "Incorrect UserName or Password" });
      } else if (results[0].status === "false") {
        return res.status(401).json({ message: "wait for admin approval" });
      } else if (results[0].password === user.password) {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(resp, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        res.status(200).json({ token: accessToken });
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
});
router.post("/forgotPassword", (req, res) => {
  const user = req.body;
  query = "select email,password from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results[0].length <= 0) {
        return res
          .status(200)
          .json({ message: "Password sent success to your email" });
      } else {
        const mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password Reset from cafe managment",
          html:
            "<p><b>Your login details for cafe management system</b><br><b>Email:</b> " +
            results[0].email +
            "<br><b>Password </b>" +
            results[0].password +
            '<br><a href="http://localhost:4200/">Click Here to login </a></p>',
        };
        transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Email sent " + info.response);
          }
        });
        return res.status(200).json({ message: "Message sent successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const query =
    "select id,name,email,contactNumbe,status from user where role='user'";
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
    const user = req.body;
    const query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User id doesn't exist" });
        }
        return res.status(200).json({ message: "user updated successfully" });
      } else {
        res.status(500).json(err);
      }
    });
  }
);
router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});
router.post("/changePassword", auth.authenticateToken, (req, res) => {
  const user = req.body;
  const email = res.locals.email;
  query = "select * from user where email=? and password=?";
  connection.query(query, [email, user.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Incorrect Old Password" });
      } else if (results[0].password === user.oldPassword) {
        query = "udpate user set password=? where email=?";
        connection.query(query, [user.newPassword, email], (err, results) => {
          if (!err) {
            return res
              .status(200)
              .json({ message: "Password updated successfully" });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
module.exports = router;
