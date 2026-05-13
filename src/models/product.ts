import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        slug: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String,
            required: true    
        },

        price: {
            type: Number,
            required: true
        },

        stock: {
            type: Number,
            default: 0
        },

        brand: {
            type: String,
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        images: {
            type: [String]
        },

        specs: {
            type: Map,
            values: String
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isFeatured: {
            type: Boolean,
            default: false
        },
    },

    { 
      timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;