const FileGarbage = require("../models/FileGarbage");

exports.getFileGarbage = async (req, res) => {
  try {
    const result = await FileGarbage.find();
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFileGarbage = async (req, res) => {
  try {
    const { _id } = req.body;

    const result = await FileGarbage.findByIdAndDelete(_id);

    if (!result) {
      return res.status(404).json({ message: "Garbage not found" });
    }

    res.status(200).json({
      message: "Garbage deleted successfully",
      data: result
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.postFileGarbage = async (req, res) => {
  try {
    const { bankName, to, accountNumber, imageUrl, visibility, userId } = req.body;

    if (!bankName || !to || !accountNumber || !imageUrl || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await FileGarbage.create({
      bankName,
      to,
      accountNumber,
      imageUrl,
      visibility: visibility || true,
      userId
    });

    res.status(201).json({
      message: "File garbage created successfully",
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};