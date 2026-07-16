import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGODB_URI as string;

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String }, { timestamps: true });
const CategorySchema = new mongoose.Schema({ name: String, slug: String, description: String, image: String }, { timestamps: true });
const ProductSchema = new mongoose.Schema({
  name: String, slug: String, description: String, price: Number, stock: Number,
  brand: String, category: mongoose.Schema.Types.ObjectId, images: [String],
  specs: { type: Map, of: String }, isActive: Boolean, isFeatured: Boolean,
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
const Category = mongoose.model("Category", CategorySchema);
const Product = mongoose.model("Product", ProductSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected");

  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({ name: "Admin", email: "admin@electroshop.com", password: hashedPassword, role: "admin" });

  // Categories
  const categories = await Category.insertMany([
    { name: "Smartphones", slug: "smartphones", description: "Latest smartphones", image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Laptops", slug: "laptops", description: "Powerful laptops", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Headphones", slug: "headphones", description: "Premium audio", image: "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Tablets", slug: "tablets", description: "Tablets & iPads", image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Cameras", slug: "cameras", description: "DSLR & mirrorless", image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Smart Home", slug: "smart-home", description: "Smart devices", image: "https://images.pexels.com/photos/1034812/pexels-photo-1034812.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]);

  const [phones, laptops, headphones, tablets, cameras, smarthome] = categories as any[];

  await Product.insertMany([
    // Smartphones
    {
      name: "iPhone 15 Pro", slug: "iphone-15-pro", brand: "Apple", price: 999, stock: 25, isActive: true, isFeatured: true,
      category: phones._id,
      description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, and a 48MP main camera system.",
      images: ["https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Display", "6.1\" Super Retina XDR"], ["Chip", "A17 Pro"], ["Camera", "48MP triple system"], ["Battery", "Up to 23h video"]]),
    },
    {
      name: "Samsung Galaxy S24 Ultra", slug: "samsung-s24-ultra", brand: "Samsung", price: 1199, stock: 18, isActive: true, isFeatured: true,
      category: phones._id,
      description: "Samsung Galaxy S24 Ultra with S Pen, 200MP camera, and Snapdragon 8 Gen 3.",
      images: ["https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Display", "6.8\" Dynamic AMOLED 2X"], ["Processor", "Snapdragon 8 Gen 3"], ["Camera", "200MP quad system"], ["RAM", "12GB"]]),
    },
    {
      name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", brand: "Google", price: 899, stock: 14, isActive: true, isFeatured: false,
      category: phones._id,
      description: "Google Pixel 8 Pro with Google Tensor G3 chip, advanced AI features and 50MP camera.",
      images: ["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Display", "6.7\" LTPO OLED"], ["Chip", "Google Tensor G3"], ["Camera", "50MP triple system"], ["Battery", "5050mAh"]]),
    },

    // Laptops
    {
      name: "MacBook Pro 14\"", slug: "macbook-pro-14", brand: "Apple", price: 1999, stock: 10, isActive: true, isFeatured: true,
      category: laptops._id,
      description: "MacBook Pro 14-inch with M3 Pro chip, Liquid Retina XDR display, and up to 22 hours battery.",
      images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Chip", "Apple M3 Pro"], ["Display", "14.2\" Liquid Retina XDR"], ["RAM", "18GB"], ["Storage", "512GB SSD"]]),
    },
    {
      name: "Dell XPS 15", slug: "dell-xps-15", brand: "Dell", price: 1499, stock: 8, isActive: true, isFeatured: true,
      category: laptops._id,
      description: "Dell XPS 15 with Intel Core i7, OLED display, and NVIDIA RTX 4060 for creative professionals.",
      images: ["https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Processor", "Intel Core i7-13700H"], ["Display", "15.6\" OLED 3.5K"], ["GPU", "NVIDIA RTX 4060"], ["RAM", "16GB"]]),
    },
    {
      name: "ASUS ROG Zephyrus G14", slug: "asus-rog-zephyrus-g14", brand: "ASUS", price: 1349, stock: 12, isActive: true, isFeatured: false,
      category: laptops._id,
      description: "ASUS ROG Zephyrus G14 gaming laptop with AMD Ryzen 9 and RTX 4060 for ultimate gaming.",
      images: ["https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Processor", "AMD Ryzen 9 7940HS"], ["GPU", "NVIDIA RTX 4060"], ["Display", "14\" QHD 165Hz"], ["RAM", "16GB DDR5"]]),
    },

    // Headphones
    {
      name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5", brand: "Sony", price: 349, stock: 30, isActive: true, isFeatured: true,
      category: headphones._id,
      description: "Sony WH-1000XM5 with industry-leading noise cancellation, 30-hour battery, and exceptional sound.",
      images: ["https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Driver", "30mm"], ["Battery", "30 hours"], ["Noise Cancelling", "Industry leading"], ["Connection", "Bluetooth 5.2"]]),
    },
    {
      name: "Apple AirPods Pro 2", slug: "airpods-pro-2", brand: "Apple", price: 249, stock: 45, isActive: true, isFeatured: true,
      category: headphones._id,
      description: "Apple AirPods Pro with H2 chip, adaptive audio, and personalized spatial audio.",
      images: ["https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Chip", "Apple H2"], ["Noise Cancelling", "Active"], ["Battery", "6h + 30h case"], ["Water Resistance", "IPX4"]]),
    },
    {
      name: "Bose QuietComfort 45", slug: "bose-quietcomfort-45", brand: "Bose", price: 279, stock: 22, isActive: true, isFeatured: false,
      category: headphones._id,
      description: "Bose QuietComfort 45 with world-class noise cancellation and TriPort acoustic architecture.",
      images: ["https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Battery", "24 hours"], ["Noise Cancelling", "Active"], ["Connection", "Bluetooth 5.1"], ["Weight", "238g"]]),
    },

    // Tablets
    {
      name: "iPad Pro 12.9\"", slug: "ipad-pro-12-9", brand: "Apple", price: 1099, stock: 15, isActive: true, isFeatured: true,
      category: tablets._id,
      description: "iPad Pro 12.9-inch with M2 chip, Liquid Retina XDR display, and support for Apple Pencil.",
      images: ["https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Chip", "Apple M2"], ["Display", "12.9\" Liquid Retina XDR"], ["Storage", "256GB"], ["Connectivity", "Wi-Fi 6E"]]),
    },
    {
      name: "Samsung Galaxy Tab S9", slug: "samsung-galaxy-tab-s9", brand: "Samsung", price: 799, stock: 20, isActive: true, isFeatured: false,
      category: tablets._id,
      description: "Samsung Galaxy Tab S9 with Snapdragon 8 Gen 2, Dynamic AMOLED display and S Pen included.",
      images: ["https://images.pexels.com/photos/2566581/pexels-photo-2566581.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Processor", "Snapdragon 8 Gen 2"], ["Display", "11\" Dynamic AMOLED"], ["RAM", "8GB"], ["Battery", "8400mAh"]]),
    },

    // Cameras
    {
      name: "Sony A7 IV", slug: "sony-a7-iv", brand: "Sony", price: 2499, stock: 6, isActive: true, isFeatured: true,
      category: cameras._id,
      description: "Sony Alpha 7 IV full-frame mirrorless camera with 33MP sensor and 4K 60fps video.",
      images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Sensor", "33MP full-frame"], ["Video", "4K 60fps"], ["Autofocus", "759-point"], ["Battery", "580 shots"]]),
    },
    {
      name: "Canon EOS R6 Mark II", slug: "canon-eos-r6-mark-ii", brand: "Canon", price: 2499, stock: 5, isActive: true, isFeatured: false,
      category: cameras._id,
      description: "Canon EOS R6 Mark II with 40fps burst, advanced AI subject detection, and 6K RAW video.",
      images: ["https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Sensor", "24.2MP full-frame"], ["Burst", "40fps"], ["Video", "6K RAW"], ["Stabilization", "8-stop IBIS"]]),
    },

    // Smart Home
    {
      name: "Amazon Echo Show 10", slug: "amazon-echo-show-10", brand: "Amazon", price: 249, stock: 35, isActive: true, isFeatured: false,
      category: smarthome._id,
      description: "Amazon Echo Show 10 with 10\" HD display that moves to face you, Alexa built-in.",
      images: ["https://images.pexels.com/photos/1034812/pexels-photo-1034812.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Display", "10.1\" HD"], ["Speaker", "Woofer + tweeter"], ["Camera", "13MP"], ["Hub", "Zigbee, Matter"]]),
    },
    {
      name: "Apple HomePod mini", slug: "apple-homepod-mini", brand: "Apple", price: 99, stock: 50, isActive: true, isFeatured: false,
      category: smarthome._id,
      description: "Apple HomePod mini with S5 chip, 360° audio, and seamless integration with Apple devices.",
      images: ["https://images.pexels.com/photos/4790267/pexels-photo-4790267.jpeg?auto=compress&cs=tinysrgb&w=800"],
      specs: new Map([["Chip", "Apple S5"], ["Audio", "360° spatial audio"], ["Smart Home", "Matter, HomeKit"], ["Color", "Multiple colors"]]),
    },
  ]);

  console.log("✅ Seeded: 1 admin, 6 categories, 15 products");
  await mongoose.disconnect();
}

seed().catch(console.error);
