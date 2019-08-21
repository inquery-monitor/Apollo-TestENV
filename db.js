const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.dbURI,
});

pool.connect(() => {
  console.log('Connected to goblinshark-aws...');
});

// pool.end();

module.exports = pool;