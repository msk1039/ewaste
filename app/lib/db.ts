import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myapp',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 30000,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production'
    ? {
      ca: process.env.DB_CA_CERT,
      // key: fs.readFileSync('./certs/key.pem'),
      // cert: fs.readFileSync('./certs/cert.pem'),
      rejectUnauthorized: true,
    }
    : {
        // For development, allow self-signed certificates
        rejectUnauthorized: false,
      },
    
});

// Execute SQL queries

export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  try {
    const [rows, fields] = await pool.execute(query, params);
    return [rows, fields];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Get a connection from the pool.
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}