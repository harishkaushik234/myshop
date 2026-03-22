import "dotenv/config";
import { connectDb } from "../src/config/db.js";
import { Feedback } from "../src/models/Feedback.js";
import { Product } from "../src/models/Product.js";
import { User } from "../src/models/User.js";

const seed = async () => {
  await connectDb();

  await Product.deleteMany();
  await Feedback.deleteMany();

  let admin = await User.findOne({ email: "admin@agroshop.com" });
  if (!admin) {
    admin = await User.create({
      name: "Shop Admin",
      email: "admin@agroshop.com",
      password: "Admin@123",
      role: "admin"
    });
  }

  let farmer = await User.findOne({ email: "farmer@agroshop.com" });
  if (!farmer) {
    farmer = await User.create({
      name: "Ravi Farmer",
      email: "farmer@agroshop.com",
      password: "Farmer@123",
      role: "client"
    });
  }

  await Product.insertMany([
    {
      name: "Neem Shield Bio Pesticide",
      category: "pesticide",
      price: 480,
      stock: 30,
      description: "Organic neem-based pesticide for sucking pests on vegetables and fruit crops.",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
      tags: ["organic", "vegetable", "pest control"],
      createdBy: admin._id
    },
    {
      name: "NPK Growth Booster 19-19-19",
      category: "fertilizer",
      price: 650,
      stock: 45,
      description: "Water-soluble balanced fertilizer for strong vegetative growth and flowering.",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
      tags: ["npk", "growth", "foliar spray"],
      createdBy: admin._id
    },
    {
      name: "Soil Revive Micronutrient Mix",
      category: "supplement",
      price: 540,
      stock: 28,
      description: "Micronutrient blend designed to reduce deficiency stress in field crops.",
      image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80",
      tags: ["zinc", "boron", "iron"],
      createdBy: admin._id
    },
    {
      name: "Drip Root Starter",
      category: "fertilizer",
      price: 720,
      stock: 20,
      description: "Starter fertilizer to support early root development after transplanting.",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
      tags: ["starter", "root", "transplant"],
      createdBy: admin._id
    },
    {
      name: "Power Spray Insect Guard",
      category: "pesticide",
      price: 390,
      stock: 52,
      description: "Broad-spectrum insect protection for cotton, chilli, and vegetable fields.",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
      tags: ["insecticide", "cotton", "vegetable"],
      createdBy: admin._id
    },
    {
      name: "Urea Plus Granules",
      category: "fertilizer",
      price: 310,
      stock: 90,
      description: "Fast-release nitrogen fertilizer for greener leaves and stronger vegetative growth.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
      tags: ["nitrogen", "urea", "leaf growth"],
      createdBy: admin._id
    },
    {
      name: "Potash Bloom Support",
      category: "fertilizer",
      price: 570,
      stock: 37,
      description: "Potassium-rich fertilizer that supports flowering, fruit size, and crop resilience.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
      tags: ["potash", "flowering", "fruit set"],
      createdBy: admin._id
    },
    {
      name: "Fungi Clean Copper Mix",
      category: "pesticide",
      price: 830,
      stock: 18,
      description: "Copper-based fungicide blend used against common leaf spot and blight conditions.",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
      tags: ["fungicide", "copper", "leaf spot"],
      createdBy: admin._id
    },
    {
      name: "SeedRise Maize Pack",
      category: "seed",
      price: 940,
      stock: 24,
      description: "Hybrid maize seed pack selected for uniform growth and good cob filling.",
      image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80",
      tags: ["maize", "hybrid", "seed"],
      createdBy: admin._id
    },
    {
      name: "Vegetable Growth Tonic",
      category: "supplement",
      price: 460,
      stock: 41,
      description: "Seaweed and amino-acid tonic that helps vegetable crops recover from stress.",
      image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80",
      tags: ["seaweed", "stress relief", "vegetable"],
      createdBy: admin._id
    },
    {
      name: "Precision Hand Sprayer",
      category: "tool",
      price: 780,
      stock: 14,
      description: "Portable hand sprayer for small farm applications and nursery maintenance.",
      image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80",
      tags: ["sprayer", "tool", "nursery"],
      createdBy: admin._id
    },
    {
      name: "RootMax Drip Booster",
      category: "supplement",
      price: 690,
      stock: 26,
      description: "Root-zone booster for drip systems to improve nutrient uptake and transplant recovery.",
      image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=800&q=80",
      tags: ["drip", "root zone", "booster"],
      createdBy: admin._id
    },
    {
      name: "Tomato Care Fungus Shield",
      category: "pesticide",
      price: 610,
      stock: 33,
      description: "Protective treatment for tomato crops prone to early blight and fungal spotting.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
      tags: ["tomato", "blight", "fungus"],
      createdBy: admin._id
    }
  ]);

  await Feedback.insertMany([
    {
      user: farmer._id,
      name: "Ravi Farmer",
      email: "farmer@agroshop.com",
      phone: "9876543210",
      type: "feedback",
      rating: 5,
      subject: "Helpful crop guidance",
      message:
        "The shopkeeper suggested the right fertilizer for my wheat crop and explained the dose clearly. The results in the field were very good.",
      status: "reviewed",
      isPublic: true
    },
    {
      name: "Mohit Yadav",
      email: "mohit.yadav@example.com",
      phone: "9123456780",
      type: "feedback",
      rating: 5,
      subject: "Good quality products",
      message:
        "Product quality is very good and prices are fair. Delivery guidance and support over chat were also quick and useful.",
      status: "reviewed",
      isPublic: true
    },
    {
      name: "Suresh Kumar",
      email: "suresh.kumar@example.com",
      phone: "9988776655",
      type: "feedback",
      rating: 4,
      subject: "Fast support and genuine advice",
      message:
        "I uploaded a crop image and got practical treatment advice. The recommended pesticide worked well and the shop response was fast.",
      status: "reviewed",
      isPublic: true
    },
    {
      name: "Pooja Devi",
      email: "pooja.devi@example.com",
      phone: "9898989898",
      type: "feedback",
      rating: 5,
      subject: "Trusted local shop",
      message:
        "This shop is reliable for seeds, fertilizers, and pest control items. I like that everything is available in one place with proper guidance.",
      status: "reviewed",
      isPublic: true
    }
  ]);

  console.log("Seed data inserted");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
