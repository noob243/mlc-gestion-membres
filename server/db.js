import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/mlc_db'
});

pool.on('connect', () => {
    console.log('[DB] Connecté à PostgreSQL');
});

pool.on('error', (err) => {
    console.error('[DB] Erreur PostgreSQL inattendue', err);
    process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);

