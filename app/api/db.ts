const { Client } = require("pg");
/**
const client = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: Number(process.env.PG_PORT) || 5432,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  timezone: 'UTC'
});

client.connect();
*/

let client: any;

try {
    if (!process.env.POSTGRES_URL) {
        console.error('Error: DATABASE_URL is not defined in the environment variables.');
        throw new Error('DATABASE_URL is required but not set.');
    }

    const connectionString = process.env.POSTGRES_URL;

    // Initialize the pg client
    client = new Client({
        connectionString,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });

    client.connect((err: Error) => {
        if (err) {
            console.error('Failed to connect to the database:', err.message);
            throw err;
        }
        console.log('Database connection established successfully.');
    });
} catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
}

export default client;

