import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      minlength: [3, "Category must be at least 3 characters"],
      lowercase: true,
      trim: true,
    },
    tag: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);
export default Category;
