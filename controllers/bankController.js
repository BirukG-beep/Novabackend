const Bank = require("../models/Bank");
const cloudinary = require("../cloudinaryConfig");
const LastPayment = require("../models/lastPayment")
const { toEthiopian } = require("ethiopian-date");
const lastPayment = require("../models/lastPayment");
// Create Bank
exports.createBank = async (req, res) => {
  try {
    const { bankName, to, accountNumber ,userId } = req.body;
    const file = req.file;
      

    if (!file) return res.status(400).json({ success: false, error: "Image is required" });

    const result = await cloudinary.uploader.upload(file.path, { folder: "banks" });

    const bank = await Bank.create({
      bankName,
      to,
      accountNumber,
      imageUrl: result.secure_url,
      userId
    });

      const today = new Date();
      const [year, ethMonth , ethDate] = toEthiopian(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );


    const lastresult = await lastPayment.find({year:year, userId:userId})
      if(!lastresult){
    const lastpaymentresult = await lastPayment({
      userId,
      year
     })
        lastpaymentresult.save()
      }
   
  
    res.status(201).json({ success: true, bank });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get All Banks
exports.getBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    console.log(banks)
    res.status(200).json({ success: true, banks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Toggle Visibility
exports.toggleVisibility = async (req, res) => {
  try {
    let { id } = req.params;

    console.log("Raw req.params.id →", JSON.stringify(id));     // better visibility
    console.log("Length:", id.length);

    // Remove accidental leading colon (very common bug pattern)
    if (id.startsWith(':')) {
      id = id.slice(1);
      console.log("Fixed leading colon → new id:", id);
    }

    // Optional: extra safety
    if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid bank ID format (must be 24-character hex string)"
      });
    }

    const bank = await Bank.findById(id);
    if (!bank) {
      return res.status(404).json({ success: false, error: "Bank not found" });
    }

    bank.visibility = !bank.visibility;
    await bank.save();

    res.status(200).json({ success: true, bank });
  } catch (error) {
    console.error("Toggle visibility error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Bank
exports.deleteBank = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await Bank.findByIdAndDelete(id);
    if (!bank) return res.status(404).json({ success: false, error: "Bank not found" });
    res.status(200).json({ success: true, message: "Bank deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserBanks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const banks = await Bank.find({ userId: userId });
    if (!banks) {
      return res.status(404).json({ message: "No banks found for this user" });
    }
    res.status(200).json(banks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

