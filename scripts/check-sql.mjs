/*import dotenv from 'dotenv';
import sql from 'mssql';

/* global process 

dotenv.config();

const pool = await sql.connect({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
});

try {
  const result = await pool.request().query(`
    SELECT
      (SELECT COUNT_BIG(1) FROM dbo.AppUsers) AS users,
      (SELECT COUNT_BIG(1) FROM dbo.UserProfiles) AS profiles,
      (SELECT COUNT_BIG(1) FROM dbo.FeedbackMessages) AS feedbacks;
  `);

  const counts = result.recordset[0];
  console.log(`AppUsers: ${counts.users}`);
  console.log(`UserProfiles: ${counts.profiles}`);
  console.log(`FeedbackMessages: ${counts.feedbacks}`);
} finally {
  await pool.close();
}
*/