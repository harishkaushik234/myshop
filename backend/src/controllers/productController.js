import { Product } from "../models/Product.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";

export const getProducts = async (req, res) => {
  const { search = "", category = "" } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $elemMatch: { $regex: search, $options: "i" } } }
    ];
  }

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
};

export const createProduct = async (req, res) => {
  let uploadedImage;
  if (req.file) {
    uploadedImage = await uploadToCloudinary(req.file.buffer, "agroshop/products");
  }

  const product = await Product.create({
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    tags: req.body.tags ? req.body.tags.split(",").map((tag) => tag.trim()) : [],
    image: uploadedImage?.secure_url || "",
    imagePublicId: uploadedImage?.public_id || "",
    createdBy: req.user._id
  });

  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let uploadedImage;
  if (req.file) {
    uploadedImage = await uploadToCloudinary(req.file.buffer, "agroshop/products");
    await deleteFromCloudinary(product.imagePublicId);
  }

  product.name = req.body.name ?? product.name;
  product.category = req.body.category ?? product.category;
  product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
  product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
  product.description = req.body.description ?? product.description;
  product.tags = req.body.tags
    ? req.body.tags.split(",").map((tag) => tag.trim())
    : product.tags;
  product.image = uploadedImage?.secure_url || product.image;
  product.imagePublicId = uploadedImage?.public_id || product.imagePublicId;

  await product.save();
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await deleteFromCloudinary(product.imagePublicId);
  await product.deleteOne();
  res.json({ message: "Product deleted" });
};
