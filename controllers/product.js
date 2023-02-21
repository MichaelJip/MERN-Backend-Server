import { asyncError } from "../middleware/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/error.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";
import { Category } from "../models/category.js";
export const getAllProduct = asyncError(async (req, res, next) => {
  // Search & Category query

  const { keyword, category } = req?.query;
  const products = await Product.find({
    name: {
      $regex: keyword ? keyword : "",
      $options: "i",
    },
    category: category ? category : undefined,
  });

  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductDetails = asyncError(async (req, res, next) => {
  const products = await Product.findById(req?.params?.id).populate("category");

  if (!products) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    products,
  });
});

export const getAdminProduct = asyncError(async (req, res, next) => {
  const products = await Product.find({}).populate("category");

  const outOfStock = products.filter((item) => item?.stock === 0);

  res.status(200).json({
    success: true,
    products,
    outOfStock: outOfStock.length,
    inStock: products.length - outOfStock.length,
  });
});

export const createProduct = asyncError(async (req, res, next) => {
  const { name, description, price, stock, category } = req?.body;

  if (!req?.file) return next(new ErrorHandler("Please Add Image", 400));

  const file = getDataUri(req?.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await Product.create({
    name,
    description,
    price,
    stock,
    category,
    images: [image],
  });

  res.status(200).json({
    success: true,
    message: "Product Created Successfully",
  });
});

export const updateProduct = asyncError(async (req, res, next) => {
  const { name, description, price, stock, category } = req?.body;

  const products = await Product.findById(req?.params?.id);
  if (!products) return next(new ErrorHandler("Product not found", 404));

  if (name) products.name = name;
  if (description) products.description = description;
  if (price) products.price = price;
  if (stock) products.stock = stock;
  if (category) products.category = category;

  await products.save();

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const addProductImage = asyncError(async (req, res, next) => {
  const products = await Product.findById(req?.params?.id);
  if (!products) return next(new ErrorHandler("Product not found", 404));

  if (!req?.file) return next(new ErrorHandler("Please Add Image", 400));

  const file = getDataUri(req?.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  products.images.push(image);

  await products.save();

  res.status(200).json({
    success: true,
    message: "Image Added Successfully",
  });
});

export const deleteProductImage = asyncError(async (req, res, next) => {
  const products = await Product.findById(req?.params?.id);
  if (!products) return next(new ErrorHandler("Product not found", 404));

  const id = req?.query?.id;

  if (!id) return next(new ErrorHandler("Please image id", 400));

  let isExist = -1;
  products.images.forEach((item, index) => {
    if (item?._id.toString() === id.toString()) isExist = index;
  });

  if (isExist < 0) return next(new ErrorHandler(`Image doesn't exist`, 400));

  await cloudinary.v2.uploader.destroy(products.images[isExist].public_id);

  products.images.splice(isExist, 1);

  await products.save();

  res.status(200).json({
    success: true,
    message: "Image Deleted Successfully",
  });
});

export const deleteProduct = asyncError(async (req, res, next) => {
  const products = await Product.findById(req?.params?.id);
  if (!products) return next(new ErrorHandler("Product not found", 404));

  for (let index = 0; index < products.images.length; index++) {
    await cloudinary.v2.uploader.destroy(products.images[index].public_id);
  }

  await products.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const addCategory = asyncError(async (req, res, next) => {
  await Category.create(req?.body);

  res.status(201).json({
    success: true,
    meesage: "Category Added Successfully",
  });
});

export const getAllCategory = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(201).json({
    success: true,
    categories,
  });
});

export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req?.params?.id);

  if (!category) return next(new ErrorHandler("Category Not Found", 404));

  const products = await Product.find({ category: category._id });

  for (let index = 0; index < products.length; index++) {
    const product = products[index];

    product.category = undefined;

    await product.save();
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});
