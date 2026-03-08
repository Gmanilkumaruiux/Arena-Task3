const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

/* Create Order */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const order = new Order({
      userId: req.user.id,
      products: req.body.products,
      totalAmount: req.body.totalAmount
    });

    const savedOrder = await order.save();
    res.json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Get User Orders */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.productId");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Get Single Order */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;