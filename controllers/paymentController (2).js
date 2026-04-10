const Payment = require("../models/Payment");
const pool = require("../db");
exports.getPaymentStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.params;
    console.log("getPaymentStatus called with userId:", userId);

    const query = `
      SELECT * FROM payments
      WHERE user_id = $1
    `;

    const result = await client.query(query, [userId]);

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // If one record per user → take first row
    const payment = result.rows;

    res.status(200).json({
      success: true,
      payment,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    client.release();
  }
};


exports.getAllPayments  = async (req, res) => {
  const client = await pool.connect();
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year query parameter is required",
      });
    }

    const query = `
      SELECT * FROM payments
      WHERE eth_year = $1
    `;

    const result = await client.query(query, [year.toString()]);

    console.log(result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found for this year",
      });
    }

    res.status(200).json({
      success: true,
      count: result.rows.length,
      payments: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    client.release();
  }
};

// PUT /api/updatePaymentStatus
exports.updatePaymentStatus = async (req, res) => {
  console.log("updatePaymentStatus called with body:", req.body);
  try {
    const { userId, month, status } = req.body;

    // 1. Get current data
    const result = await pool.query(
      `SELECT * FROM payments WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    let payment = result.rows[0];
    let months = payment.months; // JSON array

    // 2. Find month
    let found = false;

    months = months.map((m) => {
      if (m.month === month) {
        found = true;
        return { ...m, status };
      }
      return m;
    });

    // 3. If not found → push
    if (!found) {
      months.push({ month, status });
    }

    // 4. Update DB
    await pool.query(
      `UPDATE payments SET months = $1, updated_at = NOW() WHERE user_id = $2`,
      [JSON.stringify(months), userId]
    );

    res.status(200).json({ message: "Status updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLastyear = async (req, res) => {
  console.log("getLastyear called with userId:", req.params.id);
  const client = await pool.connect();
  try {
    const { id } = req.params; // user id

    // Get the latest last_payment year for this user
    const query = `
      SELECT year 
      FROM last_payments 
      WHERE user_id = $1
      ORDER BY id DESC
      LIMIT 1
    `;

    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No payment record found for this user" });
    }

    const lastYear = result.rows[0].year;

    res.status(200).json({ success: true, year: lastYear });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    client.release();
  }
};