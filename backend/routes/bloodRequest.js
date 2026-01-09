const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { sendBloodRequestAlert } = require('../services/socketService');

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

// Create blood request
router.post('/', auth, async (req, res) => {
  try {
    const { blood_group, units_needed, address, latitude, longitude } = req.body;
    const { id, role } = req.user;

    // Validate required fields
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    const finalLatitude = parseFloat(latitude);
    const finalLongitude = parseFloat(longitude);

    // Determine requester type
    let requesterType = role === 'user' ? 'user' : role;

    // Insert blood request
    const result = await pool.query(
      `INSERT INTO blood_requests (requester_id, requester_type, blood_group, units_needed, latitude, longitude, address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING *`,
      [id, requesterType, blood_group, units_needed || 1, finalLatitude, finalLongitude, address]
    );

    const request = result.rows[0];

    let allRoomIds = [];
    let locationWarning = null;

    // Only find nearby users if we have coordinates
    if (latitude && longitude) {
      // Find users within 35km radius with matching blood group
      const usersResult = await pool.query(
        `SELECT id, email, latitude, longitude FROM users 
         WHERE is_verified = TRUE 
           AND blood_group = $1
           AND id != $2
           AND latitude IS NOT NULL 
           AND longitude IS NOT NULL`,
        [blood_group, role === 'user' ? id : 0]
      );

      const nearbyUsers = usersResult.rows.filter(u =>
        haversineDistance(latitude, longitude, u.latitude, u.longitude) <= 35000
      );

      // Find NGOs within 35km
      const ngosResult = await pool.query(
        `SELECT id, latitude, longitude FROM ngos 
         WHERE latitude IS NOT NULL 
           AND longitude IS NOT NULL`
      );

      const nearbyNgos = ngosResult.rows.filter(n =>
        haversineDistance(latitude, longitude, n.latitude, n.longitude) <= 35000
      );

      // Find Blood Banks within 35km
      const bloodBanksResult = await pool.query(
        `SELECT id, latitude, longitude FROM blood_banks 
         WHERE latitude IS NOT NULL 
           AND longitude IS NOT NULL`
      );

      const nearbyBloodBanks = bloodBanksResult.rows.filter(bb =>
        haversineDistance(latitude, longitude, bb.latitude, bb.longitude) <= 35000
      );

      // Collect all room IDs for alerts
      const userRoomIds = nearbyUsers.map(u => `user-${u.id}`);
      const ngoRoomIds = nearbyNgos.map(n => `ngo-${n.id}`);
      const bloodBankRoomIds = nearbyBloodBanks.map(bb => `blood_bank-${bb.id}`);
      allRoomIds = [...userRoomIds, ...ngoRoomIds, ...bloodBankRoomIds];

      // Send real-time alerts via Socket.io
      const io = req.app.get('io');
      sendBloodRequestAlert(io, allRoomIds, {
        id: request.id,
        blood_group: request.blood_group,
        units_needed: request.units_needed,
        address: request.address,
        created_at: request.created_at
      });
    } else {
      locationWarning = 'Address could not be geocoded. Location-based alerts were not sent.';
    }

    res.status(201).json({
      message: 'Blood request created',
      request,
      alertsSent: allRoomIds.length,
      warning: locationWarning
    });
  } catch (error) {
    console.error('Create blood request error:', error);
    res.status(500).json({ error: 'Failed to create blood request' });
  }
});

// Get alerts (active requests within 35km) with requester contact info
router.get('/alerts', auth, async (req, res) => {
  try {
    const { id, role } = req.user;

    let table;
    switch (role) {
      case 'ngo':
        table = 'ngos';
        break;
      case 'blood_bank':
        table = 'blood_banks';
        break;
      default:
        table = 'users';
    }

    // Get user's location
    const userResult = await pool.query(
      `SELECT latitude, longitude FROM ${table} WHERE id = $1`,
      [id]
    );

    const userLat = userResult.rows[0]?.latitude;
    const userLng = userResult.rows[0]?.longitude;

    if (!userLat || !userLng) {
      return res.json([]);
    }

    // Get all active requests
    const requestsResult = await pool.query(
      `SELECT * FROM blood_requests 
       WHERE status = 'active'
         AND NOT (requester_id = $1 AND requester_type = $2)
         AND latitude IS NOT NULL 
         AND longitude IS NOT NULL
       ORDER BY created_at DESC`,
      [id, role]
    );

    // Filter requests within 35km
    let alerts = requestsResult.rows
      .map(r => ({
        ...r,
        distance: haversineDistance(userLat, userLng, r.latitude, r.longitude)
      }))
      .filter(r => r.distance <= 35000)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Enrich with requester contact info
    for (let alert of alerts) {
      let requesterInfo = {};
      if (alert.requester_type === 'user') {
        const userInfo = await pool.query(
          'SELECT name, email, phone FROM users WHERE id = $1',
          [alert.requester_id]
        );
        if (userInfo.rows[0]) {
          requesterInfo = userInfo.rows[0];
        }
      } else if (alert.requester_type === 'ngo') {
        const ngoInfo = await pool.query(
          'SELECT name, email, owner_name FROM ngos WHERE id = $1',
          [alert.requester_id]
        );
        if (ngoInfo.rows[0]) {
          requesterInfo = { name: ngoInfo.rows[0].name, email: ngoInfo.rows[0].email, contact_name: ngoInfo.rows[0].owner_name };
        }
      } else if (alert.requester_type === 'blood_bank') {
        const bbInfo = await pool.query(
          'SELECT name, email, contact_info FROM blood_banks WHERE id = $1',
          [alert.requester_id]
        );
        if (bbInfo.rows[0]) {
          requesterInfo = { name: bbInfo.rows[0].name, email: bbInfo.rows[0].email, phone: bbInfo.rows[0].contact_info };
        }
      }
      alert.requester = requesterInfo;
    }

    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// Accept blood request
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const { id: userId, role } = req.user;

    // Check if request is still active
    const check = await pool.query(
      'SELECT * FROM blood_requests WHERE id = $1 AND status = $2',
      [requestId, 'active']
    );

    if (check.rows.length === 0) {
      return res.status(400).json({ error: 'Request is no longer available' });
    }

    const request = check.rows[0];

    // Update request status
    await pool.query(
      `UPDATE blood_requests 
       SET status = 'fulfilled', accepted_by = $1, accepted_by_type = $2
       WHERE id = $3`,
      [userId, role, requestId]
    );

    // Create donation record
    await pool.query(
      `INSERT INTO donations (donor_id, donor_type, request_id, blood_group, units)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, role, requestId, request.blood_group, request.units_needed]
    );

    // Notify all users that this request is no longer available
    const io = req.app.get('io');
    io.emit('blood-request:accepted', { requestId: parseInt(requestId) });

    res.json({ message: 'Request accepted successfully. Thank you for your donation!' });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Get my requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const { id, role } = req.user;

    const result = await pool.query(
      `SELECT * FROM blood_requests 
       WHERE requester_id = $1 AND requester_type = $2
       ORDER BY created_at DESC`,
      [id, role]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ error: 'Failed to get requests' });
  }
});

// Cancel request
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const { id: userId, role } = req.user;

    const result = await pool.query(
      `UPDATE blood_requests 
       SET status = 'cancelled'
       WHERE id = $1 AND requester_id = $2 AND requester_type = $3 AND status = 'active'
       RETURNING id`,
      [requestId, userId, role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    // Notify others that this request is cancelled
    const io = req.app.get('io');
    io.emit('blood-request:accepted', { requestId: parseInt(requestId) });

    res.json({ message: 'Request cancelled' });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

module.exports = router;
