const express = require("express");
const router = express.Router();
const connection = require("../conn");
const { authenticateToken } = require("../services/authentication");

router.get("/details", authenticateToken, (req, res) => {
	let categoryCount;
	let productCount;
	let billCount;
	const catquery = "select count(id) as categoryCount from category";
	connection.query(catquery, (err, results) => {
		if (!err) {
			categoryCount = results[0].categoryCount;
		} else {
			return res.status(500).json(err);
		}
	});
	const productquery = "select count(id) as productCount from product";
	connection.query(productquery, (err, results) => {
		if (!err) {
			productCount = results[0].productCount;
		} else {
			return res.status(500).json(err);
		}
	});
	const billquery = "select count(id) as billCount from bill";
	connection.query(billquery, (err, results) => {
		if (!err) {
			billCount = results[0].billCount;
		} else {
			return res.status(500).json(err);
		}
	});
	const data = {
		category: categoryCount,
		product: productCount,
		bill: billCount,
	};
	return res.status(200).json(data);
});
module.exports = router;
