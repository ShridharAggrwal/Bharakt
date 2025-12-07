const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { generateToken, getExpiryDate } = require('../utils/helpers');
const { sendSignupTokenEmail } = require('../services/emailServiceSendGrid');

// Get admin profile
router.get('/profile', auth, roleCheck('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, age, gender, address, latitude as lat, longitude as lng
       FROM admins WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update admin profile
router.put('/profile', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { name, age, gender, address, latitude, longitude } = req.body;

    const result = await pool.query(
      `UPDATE admins 
       SET name = COALESCE($1, name),
           age = COALESCE($2, age),
           gender = COALESCE($3, gender),
           address = COALESCE($4, address),
           latitude = COALESCE($5, latitude),
           longitude = COALESCE($6, longitude)
       WHERE id = $7
       RETURNING id, name, email, age, gender, address, latitude, longitude`,
      [name, age, gender, address, latitude, longitude, req.user.id]
    );
    res.json({ message: 'Profile updated', admin: result.rows[0] });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await pool.query(
      'SELECT password FROM admins WHERE id = $1',
      [req.user.id]
    );

    const isMatch = await bcrypt.compare(currentPassword, admin.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE admins SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Generate signup token for NGO or Blood Bank
router.post('/generate-token', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { type, email } = req.body;

    if (!['ngo', 'blood_bank'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be ngo or blood_bank' });
    }

    const token = generateToken();
    const expiresAt = getExpiryDate(7); // 7 days expiry

    await pool.query(
      `INSERT INTO signup_tokens (token, type, created_by, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [token, type, req.user.id, expiresAt]
    );

    // Send email with signup link if email provided
    if (email) {
      try {
        await sendSignupTokenEmail(email, token, type);
      } catch (emailError) {
        console.log('Email sending failed:', emailError.message);
      }
    }

    const signupUrl = `${process.env.FRONTEND_URL}/register/${type}/${token}`;

    res.json({
      message: 'Signup token generated successfully',
      token,
      signupUrl,
      expiresAt
    });
  } catch (error) {
    console.error('Generate token error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Get dashboard stats
router.get('/stats', auth, roleCheck('admin'), async (req, res) => {
  try {
    const [users, ngos, bloodBanks, donations] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE is_verified = TRUE'),
      pool.query('SELECT COUNT(*) FROM ngos'),
      pool.query('SELECT COUNT(*) FROM blood_banks'),
      pool.query('SELECT COUNT(*) FROM donations')
    ]);

    res.json({
      approvedUsers: parseInt(users.rows[0].count),
      approvedNgos: parseInt(ngos.rows[0].count),
      approvedBloodBanks: parseInt(bloodBanks.rows[0].count),
      totalDonations: parseInt(donations.rows[0].count)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get all users
router.get('/users', auth, roleCheck('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, blood_group, is_verified, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get all NGOs
router.get('/ngos', auth, roleCheck('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, owner_name, email, volunteer_count, is_verified, status, created_at FROM ngos ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get NGOs error:', error);
    res.status(500).json({ error: 'Failed to get NGOs' });
  }
});

// Get all Blood Banks
router.get('/blood-banks', auth, roleCheck('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, contact_info, is_verified, status, created_at FROM blood_banks ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get Blood Banks error:', error);
    res.status(500).json({ error: 'Failed to get Blood Banks' });
  }
});

// Suspend user/ngo/blood_bank
router.put('/suspend/:type/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['user', 'ngo', 'blood_bank'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const table = type === 'ngo' ? 'ngos' : type === 'blood_bank' ? 'blood_banks' : 'users';

    const result = await pool.query(
      `UPDATE ${table} SET status = 'suspended' WHERE id = $1 RETURNING id, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `${type} not found` });
    }

    res.json({ message: `${type} suspended successfully`, data: result.rows[0] });
  } catch (error) {
    console.error('Suspend error:', error);
    res.status(500).json({ error: 'Failed to suspend' });
  }
});

// Activate user/ngo/blood_bank
router.put('/activate/:type/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['user', 'ngo', 'blood_bank'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const table = type === 'ngo' ? 'ngos' : type === 'blood_bank' ? 'blood_banks' : 'users';

    const result = await pool.query(
      `UPDATE ${table} SET status = 'active' WHERE id = $1 RETURNING id, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `${type} not found` });
    }

    res.json({ message: `${type} activated successfully`, data: result.rows[0] });
  } catch (error) {
    console.error('Activate error:', error);
    res.status(500).json({ error: 'Failed to activate' });
  }
});

// Delete user/ngo/blood_bank
router.delete('/delete/:type/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['user', 'ngo', 'blood_bank'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const table = type === 'ngo' ? 'ngos' : type === 'blood_bank' ? 'blood_banks' : 'users';

    // Delete related records first to avoid foreign key constraint violations
    if (type === 'blood_bank') {
      // Delete blood stock records for this blood bank
      await pool.query('DELETE FROM blood_stock WHERE blood_bank_id = $1', [id]);
    }

    if (type === 'ngo') {
      // Delete campaigns for this NGO
      await pool.query('DELETE FROM campaigns WHERE ngo_id = $1', [id]);
    }

    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `${type} not found` });
    }

    res.json({ message: `${type} deleted successfully` });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
