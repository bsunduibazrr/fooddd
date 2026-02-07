import express from "express";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import { orderModel } from "../model/order-model.js";
import { createOrder } from "../resolvers/users/controllers/order-controller.js";
import { getAllOrders } from "../resolvers/users/controllers/getAllOrders.js";

const routerOrder = express.Router();

routerOrder.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    let orders;
    if (email) {
      orders = await orderModel
        .find({ email })
        .populate("foodOrderItem.food")
        .sort({ createdAt: -1 });
    } else {
      orders = await orderModel
        .find()
        .populate("foodOrderItem.food")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

routerOrder.get("/all", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
      };
    }

    const total = await orderModel.countDocuments(filter);

    const orders = await orderModel
      .find(filter)
      .populate("foodOrderItem.food")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      orders,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(" Error while fetching orders", err);
    return res.status(500).json({ message: "Server error " });
  }
});

routerOrder.post("/create", async (req, res) => {
  try {
    const { email, address, price, items } = req.body;

    console.log("🔥 RECEIVED ORDER:", req.body);

    if (!email || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const foodOrderItems = items.map((item) => ({
      food: new ObjectId(item._id),
      quantity: item.quantity,
    }));

    const newOrder = await orderModel.create({
      email,
      address,
      price,
      foodOrderItem: foodOrderItems,
    });

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Serverin error shu :", err);
    return res.status(500).json({ message: "Server error" });
  }
});

routerOrder.put("/update-status", async (req, res) => {
  try {
    const { orderIds, status } = req.body;

    if (!orderIds || !status) {
      return res.status(400).json({ error: "orderIds, status required" });
    }

    const updatedOrders = await orderModel.updateMany(
      { _id: { $in: orderIds } },
      { $set: { states: status } },
    );

    res.json({ success: true, updatedOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

routerOrder.get("/all-controller", getAllOrders);
routerOrder.post("/", createOrder);

export default routerOrder;
