const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://divinagracia:7mFGBa3FSPTROXeF@cluster0.546ye.mongodb.net/supplierDB?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Supplier Schema
const supplierSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  email: { type: String, required: true },
  category: { type: String, required: true },
  classification: { type: String, required: true },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  account: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactEmail: { type: String, required: true },
  website: { type: String, required: true },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

// Routes
// Get all suppliers
app.get("/api/suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching suppliers", error });
  }
});

// Get a single supplier by ID
app.get("/api/suppliers/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Error fetching supplier", error });
  }
});

// Add a new supplier
app.post("/api/suppliers", async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the incoming request body
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    console.log('New supplier added:', newSupplier); // Log the inserted data
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error('Error adding supplier:', error); // Log the error
    res.status(500).json({ message: "Error adding supplier", error });
  }
});

// Update a supplier by ID
app.put("/api/suppliers/:id", async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: "Error updating supplier", error });
  }
});

// Delete a supplier by ID
app.delete("/api/suppliers/:id", async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting supplier", error });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});