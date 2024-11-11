import { Schema, model } from "mongoose";

const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "shop is required"],
      minlength: [3, "shop must be at least 3 characters"],
      trim: true,
    },
    img: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    contect: {
      type: String,
      required: [true, "Contect is required"],
    },
    more_details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Shop = model("shop", shopSchema);
export default Shop;
