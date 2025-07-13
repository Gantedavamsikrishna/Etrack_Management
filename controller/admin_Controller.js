const admin = require("../modals/admin_Scheme");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { adminId, adminName, adminEmail, adminPassword, userRole } =
      req.body;

    // Input validation
    if (!adminId || !adminName || !adminEmail || !adminPassword || !userRole) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAdmin = new admin({
      adminId,
      adminName,
      adminEmail,
      userRole,
      adminPassword, // Store plain-text password
      adminImage: req.file ? req.file.filename : null,
    });

    await newAdmin.save();
    res.status(201).json({
      message: "Admin data inserted successfully",
      newAdmin,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all admin data
const getAllAdmin = async (req, res) => {
  try {
    const admins = await admin.find();
    res.status(200).json({
      message: "All admin data",
      admins,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete admin by ID
const deleteAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const deletedAdmin = await admin.findOneAndDelete({ adminId });
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin deleted successfully",
      deletedAdmin,
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update admin by ID
const updateAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { adminName, adminEmail, adminPassword, adminImage, userRole } =
      req.body;

    const updateData = { adminName, adminEmail, adminImage, userRole };
    if (adminPassword) {
      updateData.adminPassword = adminPassword; // Store plain-text password
    }

    const updatedAdmin = await admin.findOneAndUpdate({ adminId }, updateData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin updated successfully",
      updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login admin with role-based validation (plain-text password)
const loginAdmin = async (req, res) => {
  try {
    const { adminEmail, adminPassword, userRole } = req.body;

    // Input validation
    if (!adminEmail || !adminPassword || !userRole) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    // Find admin by email
    const adminData = await admin.findOne({ adminEmail });
    console.log("Found admin:", adminData); // Debug log
    if (!adminData) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare plain-text password
    if (adminPassword !== adminData.adminPassword) {
      console.log("Password mismatch:", {
        provided: adminPassword,
        stored: adminData.adminPassword,
      }); // Debug log
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check role
    if (adminData.userRole && adminData.userRole !== userRole) {
      console.log("Role mismatch:", {
        storedRole: adminData.userRole,
        providedRole: userRole,
      }); // Debug log
      return res.status(403).json({ message: "Role mismatch" });
    }

    // Prepare JWT payload
    const payload = {
      adminId: adminData.adminId,
      adminEmail: adminData.adminEmail,
      userRole: adminData.userRole || userRole, // Fallback to provided role if missing
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      adminName: adminData.adminName,
      userRole: adminData.userRole || userRole,
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAdmin,
  getAllAdmin,
  updateAdminById,
  loginAdmin,
  deleteAdminById,
};
