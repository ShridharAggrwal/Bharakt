const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { generateToken, getExpiryDate } = require('../utils/helpers');
const { sendSignupTokenEmail } = require('../services/emailServiceSendGrid');
const { geocodeAddress } = require('../services/geocodeService');

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
    const { name, age, gender, address } = req.body;

    let latitude = null, longitude = null;
    if (address) {
      const coords = await geocodeAddress(address);
      if (coords) {
        latitude = coords.lat;
        longitude = coords.lng;
      }
    }

    let query, params;
    if (latitude && longitude) {
      query = `UPDATE admins 
               SET name = COALESCE($1, name),
                   age = COALESCE($2, age),
                   gender = COALESCE($3, gender),
                   address = COALESCE($4, address),
                   latitude = $5,
                   longitude = $6
               WHERE id = $7
               RETURNING id, name, email, age, gender, address`;
      params = [name, age, gender, address, latitude, longitude, req.user.id];
    } else {
      query = `UPDATE admins 
               SET name = COALESCE($1, name),
                   age = COALESCE($2, age),
                   gender = COALESCE($3, gender),
                   address = COALESCE($4, address)
               WHERE id = $5
               RETURNING id, name, email, age, gender, address`;
      params = [name, age, gender, address, req.user.id];
    }

    const result = await pool.query(query, params);
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
    const [users, ngos, bloodBanks, pendingNgos, pendingBloodBanks, donations] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE is_verified = TRUE'),
      pool.query('SELECT COUNT(*) FROM ngos WHERE is_approved = TRUE'),
      pool.query('SELECT COUNT(*) FROM blood_banks WHERE is_approved = TRUE'),
      pool.query('SELECT COUNT(*) FROM ngos WHERE is_approved = FALSE'),
      pool.query('SELECT COUNT(*) FROM blood_banks WHERE is_approved = FALSE'),
      pool.query('SELECT COUNT(*) FROM donations')
    ]);

    res.json({
      approvedUsers: parseInt(users.rows[0].count),
      approvedNgos: parseInt(ngos.rows[0].count),
      approvedBloodBanks: parseInt(bloodBanks.rows[0].count),
      pendingNgos: parseInt(pendingNgos.rows[0].count),
      pendingBloodBanks: parseInt(pendingBloodBanks.rows[0].count),
      totalDonations: parseInt(donations.rows[0].count)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get pending approvals
router.get('/pending-approvals', auth, roleCheck('admin'), async (req, res) => {
  try {
    const [ngos, bloodBanks] = await Promise.all([
      pool.query('SELECT id, name, owner_name, email, address, created_at FROM ngos WHERE is_approved = FALSE'),
      pool.query('SELECT id, name, email, contact_info, address, created_at FROM blood_banks WHERE is_approved = FALSE')
    ]);

    res.json({
      ngos: ngos.rows,
      bloodBanks: bloodBanks.rows
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ error: 'Failed to get pending approvals' });
  }
});

// Approve NGO or Blood Bank
router.put('/approve/:type/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['ngo', 'blood_bank'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const table = type === 'ngo' ? 'ngos' : 'blood_banks';

    await pool.query(
      `UPDATE ${table} SET is_approved = TRUE WHERE id = $1`,
      [id]
    );

    res.json({ message: `${type === 'ngo' ? 'NGO' : 'Blood Bank'} approved successfully` });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ error: 'Failed to approve' });
  }
});

// Get all users
router.get('/users', auth, roleCheck('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, blood_group, is_verified, created_at FROM users ORDER BY created_at DESC'
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
      'SELECT id, name, owner_name, email, volunteer_count, is_approved, created_at FROM ngos ORDER BY created_at DESC'
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
      'SELECT id, name, email, contact_info, is_approved, created_at FROM blood_banks ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get Blood Banks error:', error);
    res.status(500).json({ error: 'Failed to get Blood Banks' });
  }
});

module.exports = router;
