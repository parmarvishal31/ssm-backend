import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product is required"],
      minlength: [3, "product must be at least 3 characters"],
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
    img: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);
export default Product;
