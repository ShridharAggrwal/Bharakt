const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get NGO profile
router.get('/profile', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, owner_name, email, age, gender, address, volunteer_count,
              latitude as lat, longitude as lng
       FROM ngos WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get NGO profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update NGO profile
router.put('/profile', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const { name, owner_name, age, gender, address, volunteer_count, latitude, longitude } = req.body;

    const result = await pool.query(
      `UPDATE ngos 
       SET name = COALESCE($1, name),
           owner_name = COALESCE($2, owner_name),
           age = COALESCE($3, age),
           gender = COALESCE($4, gender),
           address = COALESCE($5, address),
           volunteer_count = COALESCE($6, volunteer_count),
           latitude = COALESCE($7, latitude),
           longitude = COALESCE($8, longitude)
       WHERE id = $9
       RETURNING id, name, owner_name, email, age, gender, address, volunteer_count, latitude, longitude`,
      [name, owner_name, age, gender, address, volunteer_count, latitude, longitude, req.user.id]
    );
    res.json({ message: 'Profile updated', ngo: result.rows[0] });
  } catch (error) {
    console.error('Update NGO profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const ngo = await pool.query(
      'SELECT password FROM ngos WHERE id = $1',
      [req.user.id]
    );

    const isMatch = await bcrypt.compare(currentPassword, ngo.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE ngos SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get NGO dashboard stats
router.get('/stats', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const [activeCampaigns, totalCampaigns, ngoInfo] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM campaigns WHERE ngo_id = $1 AND status = $2', [req.user.id, 'active']),
      pool.query('SELECT COUNT(*) FROM campaigns WHERE ngo_id = $1', [req.user.id]),
      pool.query('SELECT volunteer_count, campaigns_count, blood_requests_accepted FROM ngos WHERE id = $1', [req.user.id])
    ]);

    res.json({
      activeCampaigns: parseInt(activeCampaigns.rows[0].count),
      totalCampaigns: parseInt(totalCampaigns.rows[0].count),
      volunteerCount: ngoInfo.rows[0].volunteer_count,
      campaignsCount: ngoInfo.rows[0].campaigns_count || 0,
      bloodRequestsAccepted: ngoInfo.rows[0].blood_requests_accepted || 0
    });
  } catch (error) {
    console.error('Get NGO stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Create campaign
router.post('/campaigns', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const { title, address, latitude, longitude, start_date, end_date, health_checkup_available, partner_bank_ids } = req.body;

    // Validate required fields
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Location coordinates are required. Please allow location access or enter manually.'
      });
    }

    const finalLatitude = parseFloat(latitude);
    const finalLongitude = parseFloat(longitude);

    const result = await pool.query(
      `INSERT INTO campaigns (ngo_id, title, latitude, longitude, address, start_date, end_date, status, health_checkup_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8)
       RETURNING *`,
      [req.user.id, title, finalLatitude, finalLongitude, address, start_date, end_date, health_checkup_available || false]
    );

    // Increment campaigns_count for NGO
    await pool.query(
      'UPDATE ngos SET campaigns_count = campaigns_count + 1 WHERE id = $1',
      [req.user.id]
    );

    // Send collaboration invitation emails to partner blood banks
    let emailsSent = 0;
    if (partner_bank_ids && partner_bank_ids.length > 0) {
      // Get NGO info for the email
      const ngoInfo = await pool.query(
        'SELECT name, owner_name, email FROM ngos WHERE id = $1',
        [req.user.id]
      );
      const ngo = ngoInfo.rows[0];

      // Get blood bank emails
      const banksResult = await pool.query(
        'SELECT id, name, email FROM blood_banks WHERE id = ANY($1::int[])',
        [partner_bank_ids]
      );

      // Format dates for email
      const startDateFormatted = new Date(start_date).toLocaleString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit'
      });
      const endDateFormatted = new Date(end_date).toLocaleString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      // Send email to each blood bank
      const emailService = require('../services/email');
      for (const bank of banksResult.rows) {
        if (bank.email) {
          try {
            await emailService.sendEmail({
              to: bank.email,
              subject: `Collaboration Invitation: ${title} - Blood Donation Campaign`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🩸 Blood Donation Campaign Invitation</h1>
                  </div>
                  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                    <p style="font-size: 16px; color: #374151;">Dear <strong>${bank.name}</strong> Team,</p>
                    
                    <p style="color: #4b5563; line-height: 1.6;">
                      We are pleased to invite you to collaborate with us on an upcoming blood donation campaign. 
                      Your expertise and support would be invaluable in making this event a success.
                    </p>

                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                      <h3 style="color: #b91c1c; margin: 0 0 10px 0;">${title}</h3>
                      <p style="color: #7f1d1d; margin: 5px 0;"><strong>📍 Location:</strong> ${address}</p>
                      <p style="color: #7f1d1d; margin: 5px 0;"><strong>📅 Start:</strong> ${startDateFormatted}</p>
                      <p style="color: #7f1d1d; margin: 5px 0;"><strong>📅 End:</strong> ${endDateFormatted}</p>
                      ${health_checkup_available ? '<p style="color: #7f1d1d; margin: 5px 0;"><strong>⚕️</strong> Free health checkups will be offered to donors</p>' : ''}
                    </div>

                    <p style="color: #4b5563; line-height: 1.6;">
                      We believe that your participation would significantly enhance the impact of this campaign 
                      and help save more lives in our community.
                    </p>

                    <p style="color: #4b5563; line-height: 1.6;">
                      If you are interested in partnering with us, please reach out at your earliest convenience.
                    </p>

                    <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; margin: 5px 0;">With regards,</p>
                      <p style="color: #374151; font-weight: bold; margin: 5px 0;">${ngo.owner_name || ngo.name}</p>
                      <p style="color: #6b7280; margin: 5px 0;">${ngo.name}</p>
                      ${ngo.email ? `<p style="color: #6b7280; margin: 5px 0;">Email: ${ngo.email}</p>` : ''}
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px; text-align: center;">
                      <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        This is an automated message from the Bharakt Blood Donation Platform.
                      </p>
                    </div>
                  </div>
                </div>
              `
            });
            emailsSent++;
          } catch (emailError) {
            console.error(`Failed to send email to ${bank.email}:`, emailError);
          }
        }
      }
    }

    res.status(201).json({ 
      message: 'Campaign created', 
      campaign: result.rows[0],
      emailsSent 
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Get all campaigns for NGO
router.get('/campaigns', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM campaigns 
       WHERE ngo_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to get campaigns' });
  }
});

// Update campaign
router.put('/campaigns/:id', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, address, latitude, longitude, start_date, end_date, status } = req.body;

    // Verify campaign belongs to this NGO
    const check = await pool.query(
      'SELECT id FROM campaigns WHERE id = $1 AND ngo_id = $2',
      [id, req.user.id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Build update query dynamically based on provided fields
    const result = await pool.query(
      `UPDATE campaigns 
       SET title = COALESCE($1, title),
           address = COALESCE($2, address),
           latitude = COALESCE($3, latitude),
           longitude = COALESCE($4, longitude),
           start_date = COALESCE($5, start_date),
           end_date = COALESCE($6, end_date),
           status = COALESCE($7, status)
       WHERE id = $8
       RETURNING *`,
      [title, address, latitude, longitude, start_date, end_date, status, id]
    );

    res.json({ message: 'Campaign updated', campaign: result.rows[0] });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// End campaign with blood units collected
router.put('/campaigns/:id/end', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { blood_units_collected } = req.body;

    // Validate blood units
    if (blood_units_collected === undefined || blood_units_collected === null) {
      return res.status(400).json({ error: 'Blood units collected is required' });
    }

    if (blood_units_collected < 0) {
      return res.status(400).json({ error: 'Blood units collected must be a positive number' });
    }

    // Verify campaign belongs to this NGO and is active
    const check = await pool.query(
      'SELECT id, status FROM campaigns WHERE id = $1 AND ngo_id = $2',
      [id, req.user.id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (check.rows[0].status === 'ended') {
      return res.status(400).json({ error: 'Campaign has already ended' });
    }

    // End campaign
    const result = await pool.query(
      `UPDATE campaigns 
       SET status = 'ended',
           blood_units_collected = $1,
           ended_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [blood_units_collected, id]
    );

    res.json({
      message: `Campaign ended successfully. ${blood_units_collected} units collected.`,
      campaign: result.rows[0]
    });
  } catch (error) {
    console.error('End campaign error:', error);
    res.status(500).json({ error: 'Failed to end campaign' });
  }
});

// Delete campaign
router.delete('/campaigns/:id', auth, roleCheck('ngo'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM campaigns WHERE id = $1 AND ngo_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

module.exports = router;
