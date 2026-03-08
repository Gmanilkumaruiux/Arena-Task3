const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

/* Get logged-in user's cart */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id })
      .populate("productId");

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Add product to cart */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cartItem = new Cart({
      userId: req.user.id,
      productId,
      quantity
    });

    const savedItem = await cartItem.save();
    res.json(savedItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Remove item from cart */
router.delete("/:itemId", authMiddleware, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.itemId);

    res.json({ message: "Item removed from cart" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;