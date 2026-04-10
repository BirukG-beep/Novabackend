// fileGarbageController.js

const pool = require('../db'); // Make sure your pg Pool is exported from db.js

// GET all FileGarbage
exports.getFileGarbage = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM file_garbage`);
    res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a FileGarbage record
exports.deleteFileGarbage = async (req, res) => {
  console.log(req.body)
  try {
    const { id } = req.body; // Use numeric id for PostgreSQL

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await pool.query(
      `DELETE FROM file_garbage WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Garbage not found" });
    }

    res.status(200).json({
      message: "Garbage deleted successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a new FileGarbage record
// controllers/fileGarbageController.js
exports.postFileGarbageAndDeleteBank = async (req, res) => {
  console.log("Incoming body:", req.body);
  try {
    let { id, bankName, to, accountNumber, imageUrl, visibility, userId } = req.body;

    if (!id || !bankName || !to || !accountNumber || !imageUrl || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure numeric IDs
    id = parseInt(id);
    userId = parseInt(userId);
    if (isNaN(id) || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid id or userId" });
    }

    // Start a transaction
    await pool.query("BEGIN");

    // 1️⃣ Insert into file_garbage
    const insertResult = await pool.query(
      `INSERT INTO file_garbage 
        (bank_name, "to", account_number, image_url, visibility, user_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [bankName, to, accountNumber, imageUrl, visibility ?? true, userId]
    );

  console.log('Inserted row:', insertResult.rows[0]);
    // 2️⃣ Delete from banks table using the same id
    const deleteResult = await pool.query(
      `DELETE FROM banks WHERE id = $1 RETURNING *`,
      [id]
    );

    if (deleteResult.rows.length === 0) {
      // Rollback if bank id not found
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Bank not found for deletion" });
    }

    // Commit transaction
    await pool.query("COMMIT");

    res.status(201).json({
      message: "File garbage created and bank deleted successfully",
      fileGarbage: insertResult.rows[0],
      deletedBank: deleteResult.rows[0]
    });

  } catch (error) {
    console.error("PostFileGarbageAndDeleteBank Error:", error);
    // Rollback on any error
    await pool.query("ROLLBACK");
    res.status(500).json({ message: "Server error" });
  }
};