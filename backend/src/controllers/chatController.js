import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";
import { getIo } from "../config/socket.js";

export const getContacts = async (req, res) => {
  const query = req.user.role === "admin" ? { role: "client" } : { role: "admin" };
  const [contacts, unreadCounts] = await Promise.all([
    User.find(query).select("name email role rewardPoints badges"),
    Chat.aggregate([
      {
        $match: {
          receiver: req.user._id,
          read: false
        }
      },
      {
        $group: {
          _id: "$sender",
          unreadCount: { $sum: 1 }
        }
      }
    ])
    ])
  ;

  const unreadCountMap = new Map(
    unreadCounts.map((entry) => [String(entry._id), entry.unreadCount])
  );

  res.json(
    contacts.map((contact) => ({
      ...contact.toObject(),
      unreadCount: unreadCountMap.get(String(contact._id)) || 0
    }))
  );
};

export const getConversation = async (req, res) => {
  const { otherUserId } = req.params;

  await Chat.updateMany(
    {
      sender: otherUserId,
      receiver: req.user._id,
      read: false
    },
    {
      $set: { read: true }
    }
  );

  const messages = await Chat.find({
    $or: [
      { sender: req.user._id, receiver: otherUserId },
      { sender: otherUserId, receiver: req.user._id }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
};

export const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;

  const chat = await Chat.create({
    sender: req.user._id,
    receiver: receiverId,
    message
  });

  const populatedChat = await chat.populate([
    { path: "sender", select: "name role" },
    { path: "receiver", select: "name role" }
  ]);

  const io = getIo();
  if (io) {
    io.to(`user:${receiverId}`).emit("chat:new", populatedChat);
    io.to(`user:${req.user._id}`).emit("chat:new", populatedChat);
  }

  res.status(201).json(populatedChat);
};
