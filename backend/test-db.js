const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔍 Testing AWS RDS MySQL Connection...\n');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Connection successful!');
        console.log('\n📊 Database Information:');
        console.log(`  Host: ${process.env.DB_HOST}`);
        console.log(`  Database: ${process.env.DB_NAME}`);
        console.log(`  Port: ${process.env.DB_PORT}`);

        // Test queries
        console.log('\n📋 Testing Queries:');

        // Test 1: Check tables
        const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ?
        `, [process.env.DB_NAME]);

        console.log('\n  📦 Tables in database:');
        tables.forEach((table, i) => {
            console.log(`    ${i + 1}. ${table.TABLE_NAME}`);
        });

        // Test 2: Check row counts
        const [rumahCount] = await connection.execute('SELECT COUNT(*) as count FROM rumah');
        const [petugasCount] = await connection.execute('SELECT COUNT(*) as count FROM petugas');
        const [jadwalCount] = await connection.execute('SELECT COUNT(*) as count FROM jadwal');

        console.log('\n  📊 Row Counts:');
        console.log(`    Rumah: ${rumahCount[0].count} rows`);
        console.log(`    Petugas: ${petugasCount[0].count} rows`);
        console.log(`    Jadwal: ${jadwalCount[0].count} rows`);

        // Test 3: Sample data
        if (rumahCount[0].count > 0) {
            const [rumah] = await connection.execute('SELECT * FROM rumah LIMIT 1');
            console.log('\n  📝 Sample Rumah:');
            console.log(`    ${JSON.stringify(rumah[0], null, 2)}`);
        }

        connection.end();
        console.log('\n✅ All tests passed! Database is ready to use.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('\nError Details:');
        console.error(`  Code: ${error.code}`);
        console.error(`  Message: ${error.message}`);
        
        console.log('\n🔧 Troubleshooting:');
        console.log('  1. Check .env file exists and has correct values');
        console.log('  2. Verify RDS endpoint is correct');
        console.log('  3. Check database username and password');
        console.log('  4. Ensure RDS security group allows port 3306');
        console.log('  5. Test connection from terminal: mysql -h <endpoint> -u <user> -p');
        
        process.exit(1);
    }
}

testConnection();
