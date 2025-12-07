const pool = require('./db');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existing = await pool.query('SELECT id FROM admins WHERE email = $1', ['admin@bloodlink.com']);
    
    if (existing.rows.length > 0) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Admin coordinates: Bangalore, Karnataka, India
    const latitude = 12.969028894136608;
    const longitude = 77.72276389548833;

    await pool.query(
      `INSERT INTO admins (name, email, password, age, gender, address, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      ['Admin', 'admin@bloodlink.com', hashedPassword, 30, 'male', 'Bangalore, Karnataka, India', latitude, longitude]
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@bloodlink.com');
    console.log('Password: Admin@123');
    console.log('Location: Bangalore, Karnataka, India');
    console.log(`Coordinates: ${latitude}, ${longitude}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

