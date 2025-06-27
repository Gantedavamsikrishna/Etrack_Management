const admin = require("../modals/admin_Scheme");

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { adminId, adminName, adminEmail, adminPassword } = req.body;
    const newAdmin = new admin({
      adminId,
      adminName,
      adminEmail,
      adminPassword,
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

// get all admin data
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
//delete admin

const deleteAdminById = async (req, res) => {
  try {
    const { adminId } = req.params; // Use route parameter for adminId
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

//update admin by id
const updateAdminById = async (req, res) => {
  try {
    const { adminId } = req.params; // Use route parameter for adminId
    const { adminName, adminEmail, adminPassword, adminImage } = req.body;
    const updatedAdmin = await admin.findOneAndUpdate(
      { adminId }, // Find by adminId field, not _id
      { adminName, adminEmail, adminPassword, adminImage },
      { new: true }
    );
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
//login admin
const loginAdmin = async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    const adminData = await admin.findOne({
      adminEmail,
      adminPassword,
    });
    if (!adminData) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      message: "Login successful",
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
