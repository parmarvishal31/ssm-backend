import Category from "../models/category.model.js";

import cloudinary from "cloudinary";
import fs from "fs/promises";
import Product from "../models/product.model.js";

const createProduct = async (req, res) => {
  const { name, ...otherFields } = req.body;
  try {
    const productExist = await Product.findOne({ name });

    if (productExist) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = await Product.create({
      name,
      ...otherFields,
    });

    if (!product) {
      return res
        .status(400)
        .json({ message: "Failed to create product, please try again" });
    }

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "cms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          product.img.public_id = result.public_id;
          product.img.secure_url = result.secure_url;
        }
      } catch (error) {
        return res.status(400).json({
          message: error.message || "File not uploaded, please try again",
        });
      } finally {
        try {
          await fs.rm(`uploads/${req.file.filename}`);
        } catch (err) {
          console.log("Error removing file:", err);
        }
      }
    }

    await product.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Create product error!!" });
  }
};

const getProducts = async (req, res) => {
  const search = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }],
      };
    }
    const skip = (page - 1) * limit;
    const product = await Product.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    if (product.length === 0) {
      return res.status(404).json({ message: "No matching categories found." });
    }

    res.status(200).json({
      data: product,
      currentPage: page,
      totalPages: Math.ceil(product.length / limit),
      totalItems: product.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Find product error!!" });
  }
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Find product error!!" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, ...otherFields } = req.body;
  const cid = req.body.category_id || "";

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.name = name || product.name;
    Object.assign(product, otherFields);

    if (cid) {
      const category = await Category.findById(cid);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      } else {
        category.products.push(product._id);
        await category.save();
      }
    }

    if (req.file) {
      try {
        if (product.img.public_id) {
          await cloudinary.v2.uploader.destroy(product.img.public_id);
        }
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "cms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          product.img.public_id = result.public_id;
          product.img.secure_url = result.secure_url;
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return res.status(400).json({
          message: error.message || "File not uploaded, please try again",
        });
      }
    }
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update category error!!" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    if (product.img && product.img.public_id) {
      await cloudinary.v2.uploader.destroy(product.img.public_id);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "product and associated image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Delete product error!!" });
  }
};

export {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
