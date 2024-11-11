import Category from "../models/category.model.js";

import cloudinary from "cloudinary";
import fs from "fs/promises";

const createCategory = async (req, res) => {
  const { name, ...otherFields } = req.body;

  try {
    const categoryExist = await Category.findOne({ name });

    if (categoryExist) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      ...otherFields,
    });

    if (!category) {
      return res
        .status(400)
        .json({ message: "Failed to create category, please try again" });
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
          category.img.public_id = result.public_id;
          category.img.secure_url = result.secure_url;

          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return res.status(400).json({
          message: error.message || "File not uploaded, please try again",
        });
      }
    }

    // Save the new category and respond with success
    await category.save();
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Create category error!!" });
  }
};

const getCategory = async (req, res) => {
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
    const category = await Category.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    if (category.length === 0) {
      return res.status(404).json({ message: "No matching categories found." });
    }

    res.status(200).json({
      data: category,
      currentPage: page,
      totalPages: Math.ceil(category.length / limit),
      totalItems: category.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Find category error!!" });
  }
};

const getSingleCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Find category error!!" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, ...otherFields } = req.body;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category fields
    category.name = name || category.name;
    Object.assign(category, otherFields);

    if (req.file) {
      try {
        // Delete the old image from Cloudinary if it exists
        if (category.img.public_id) {
          await cloudinary.v2.uploader.destroy(category.img.public_id);
        }

        // Upload the new image to Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "cms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          // Update the image details in the category
          category.img.public_id = result.public_id;
          category.img.secure_url = result.secure_url;

          // Remove the uploaded file from local storage
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return res.status(400).json({
          message: error.message || "File not uploaded, please try again",
        });
      }
    }

    // Save the updated category
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update category error!!" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the category by ID to get the public_id of the image
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the image from Cloudinary if it exists
    if (category.img && category.img.public_id) {
      await cloudinary.v2.uploader.destroy(category.img.public_id);
    }

    // Delete the category from the database
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category and associated image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Delete category error!!" });
  }
};

export {
  createCategory,
  getCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
