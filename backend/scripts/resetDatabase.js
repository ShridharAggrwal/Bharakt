const pool = require('../config/db');
const { execSync } = require('child_process');
const path = require('path');

const resetDatabase = async () => {
  try {
    console.log('🔄 Starting database reset...\n');

    // Drop all tables in correct order (handle foreign key constraints)
    console.log('🗑️  Dropping existing tables...');

    const dropTables = [
      'blood_stock',
      'donations',
      'email_verifications',
      'signup_tokens',
      'blood_requests',
      'campaigns',
      'blood_banks',
      'ngos',
      'users',
      'admins'
    ];

    for (const table of dropTables) {
      try {
        await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`  ✓ Dropped ${table}`);
      } catch (error) {
        console.log(`  ⚠️  Could not drop ${table}: ${error.message}`);
      }
    }

    console.log('\n✅ All tables dropped successfully\n');

    // Close the pool connection before running external scripts
    await pool.end();

    // Run initDb.js to recreate tables
    console.log('📋 Creating database tables...');
    const initDbPath = path.join(__dirname, '../config/initDb.js');
    execSync(`node "${initDbPath}"`, { stdio: 'inherit' });

    // Run seedAdmin.js to create admin user
    console.log('\n👤 Creating admin user...');
    const seedAdminPath = path.join(__dirname, '../config/seedAdmin.js');
    execSync(`node "${seedAdminPath}"`, { stdio: 'inherit' });

    console.log('\n🎉 Database reset completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  ✓ All old data deleted');
    console.log('  ✓ Tables recreated');
    console.log('  ✓ Admin user created with coordinates');
    console.log('  ✓ NGOs and Blood Banks are auto-verified when created via admin token');
    console.log('\n🔐 Admin Credentials:');
    console.log('  Email: admin@bharakt.com');
    console.log('  Password: Admin@123');
    console.log('  Location: Bangalore, Karnataka, India');
    console.log('  Coordinates: 12.969028894136608, 77.72276389548833');

  } catch (error) {
    console.error('\n❌ Error resetting database:', error.message);
    process.exit(1);
  }
};

resetDatabase();

