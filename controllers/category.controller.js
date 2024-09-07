import Category from "../models/category.model.js";

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

    // Save the new category and respond with success
    await category.save();
    res.status(201).json({
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
  const limit = parseInt(req.query.limit) || 10;
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

export { createCategory, getCategory };
