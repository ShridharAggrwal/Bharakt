const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Haversine formula to calculate distance in meters
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get profile
router.get('/profile', auth, roleCheck('user'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, gender, blood_group, address, latitude as lat, longitude as lng
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/profile', auth, roleCheck('user'), async (req, res) => {
  try {
    const { name, phone, gender, blood_group, address, latitude, longitude } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           gender = COALESCE($3, gender),
           blood_group = COALESCE($4, blood_group),
           address = COALESCE($5, address),
           latitude = COALESCE($6, latitude),
           longitude = COALESCE($7, longitude)
       WHERE id = $8
       RETURNING id, name, email, phone, gender, blood_group, address, latitude, longitude`,
      [name, phone, gender, blood_group, address, latitude, longitude, req.user.id]
    );
    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', auth, roleCheck('user'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current password
    const user = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [req.user.id]
    );

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get donation and request history
router.get('/history', auth, roleCheck('user'), async (req, res) => {
  try {
    // Get donations made
    const donations = await pool.query(
      `SELECT d.*, br.address as request_address
       FROM donations d
       LEFT JOIN blood_requests br ON d.request_id = br.id
       WHERE d.donor_id = $1 AND d.donor_type = 'user'
       ORDER BY d.donated_at DESC`,
      [req.user.id]
    );

    // Get blood requests made
    const requests = await pool.query(
      `SELECT * FROM blood_requests 
       WHERE requester_id = $1 AND requester_type = 'user'
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      donations: donations.rows,
      requests: requests.rows
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// Get nearby campaigns and blood banks (for users and NGOs)
router.get('/nearby', auth, async (req, res) => {
  try {
    // Get location based on role
    let userLat, userLng;
    
    if (req.user.role === 'user') {
      const userResult = await pool.query(
        'SELECT latitude, longitude FROM users WHERE id = $1',
        [req.user.id]
      );
      userLat = userResult.rows[0]?.latitude;
      userLng = userResult.rows[0]?.longitude;
    } else if (req.user.role === 'ngo') {
      const ngoResult = await pool.query(
        'SELECT latitude, longitude FROM ngos WHERE id = $1',
        [req.user.id]
      );
      userLat = ngoResult.rows[0]?.latitude;
      userLng = ngoResult.rows[0]?.longitude;
    } else if (req.user.role === 'blood_bank') {
      const bbResult = await pool.query(
        'SELECT latitude, longitude FROM blood_banks WHERE id = $1',
        [req.user.id]
      );
      userLat = bbResult.rows[0]?.latitude;
      userLng = bbResult.rows[0]?.longitude;
    } else if (req.user.role === 'admin') {
      const adminResult = await pool.query(
        'SELECT latitude, longitude FROM admins WHERE id = $1',
        [req.user.id]
      );
      userLat = adminResult.rows[0]?.latitude;
      userLng = adminResult.rows[0]?.longitude;
    }

    if (!userLat || !userLng) {
      return res.status(400).json({ error: 'Your location is not set. Please update your profile location.' });
    }

    // Get all active campaigns with NGO contact info
    const campaignsResult = await pool.query(
      `SELECT c.*, n.name as ngo_name, n.email as ngo_email, n.owner_name, c.latitude, c.longitude
       FROM campaigns c
       JOIN ngos n ON c.ngo_id = n.id
       WHERE c.status = 'active'`
    );

    // Filter campaigns within 35km
    const campaigns = campaignsResult.rows
      .filter(c => c.latitude && c.longitude)
      .map(c => ({
        ...c,
        distance: haversineDistance(userLat, userLng, c.latitude, c.longitude)
      }))
      .filter(c => c.distance <= 35000)
      .sort((a, b) => a.distance - b.distance);

    // Get all blood banks with stock info
    const bloodBanksResult = await pool.query(
      `SELECT bb.id, bb.name, bb.email, bb.address, bb.contact_info, bb.latitude, bb.longitude
       FROM blood_banks bb`
    );

    // Get stock for all blood banks
    const stockResult = await pool.query(
      `SELECT blood_bank_id, blood_group, units_available FROM blood_stock`
    );

    // Create stock lookup map (as object with blood_group keys)
    const stockByBank = {};
    stockResult.rows.forEach(s => {
      if (!stockByBank[s.blood_bank_id]) {
        stockByBank[s.blood_bank_id] = {};
      }
      stockByBank[s.blood_bank_id][s.blood_group] = s.units_available;
    });

    // Filter blood banks within 35km and add stock
    const bloodBanks = bloodBanksResult.rows
      .filter(bb => bb.latitude && bb.longitude)
      .map(bb => ({
        ...bb,
        distance: haversineDistance(userLat, userLng, bb.latitude, bb.longitude),
        stock: stockByBank[bb.id] || []
      }))
      .filter(bb => bb.distance <= 35000)
      .sort((a, b) => a.distance - b.distance);

    res.json({ campaigns, bloodBanks });
  } catch (error) {
    console.error('Get nearby error:', error);
    res.status(500).json({ error: 'Failed to get nearby locations' });
  }
});

module.exports = router;
