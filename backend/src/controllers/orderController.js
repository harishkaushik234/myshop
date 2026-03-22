import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { getIo } from "../config/socket.js";
import { grantReward } from "../utils/rewardUtils.js";

export const createOrder = async (req, res) => {
  const { items, shippingAddress, notes } = req.body;

  if (!items?.length) {
    return res.status(400).json({ message: "Order items are required" });
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const normalizedItems = items.map((item) => {
    const product = products.find((entry) => String(entry._id) === item.productId);

    if (!product) {
      throw new Error(`Product not found for ${item.productId}`);
    }

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image
    };
  });

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    totalAmount,
    shippingAddress,
    notes
  });

  await grantReward({
    userId: req.user._id,
    action: "purchase",
    points: Math.max(10, Math.round(totalAmount / 20)),
    description: `Placed an order worth Rs. ${totalAmount}`
  });

  const populatedOrder = await order.populate({ path: "user", select: "name email" });
  const io = getIo();
  if (io) {
    io.to("role:admin").emit("order:new", {
      _id: populatedOrder._id,
      totalAmount: populatedOrder.totalAmount,
      createdAt: populatedOrder.createdAt,
      user: populatedOrder.user
    });
  }

  res.status(201).json(populatedOrder);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = req.body.status ?? order.status;
  await order.save();

  res.json(order);
};
