require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();

const PORT = 8080 || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schema
const SocialMediaLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false } // Disable the _id field for this schema
);

const CreatorSchema = new mongoose.Schema(
  {
    bannerImageUrl: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    languages: [String],
    education: {
      type: String,
      trim: true,
      default: "N/A",
    },
    specializations: [String],
    socialMediaLinks: { type: [SocialMediaLinkSchema] },
  },
  {
    versionKey: false,
  }
);

// Model
const CreatorModel = mongoose.model("Creator", CreatorSchema);

// Controllers
const getAllCreatorsController = async (req, res) => {
  try {
    const creators = await CreatorModel.find();

    res.status(200).json({
      message: "Creators fetched successfully",
      success: true,
      error: false,
      creators,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};

// Routes
router.get("/all-creators", getAllCreatorsController);

// Router
app.use("/api", router);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Server connected to MongoDB`);
    console.log(`Server running on port: ${PORT}`);
  } catch (error) {
    console.log("Error: ", error.message || error);
  }
});
