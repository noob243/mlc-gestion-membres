import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Parses a simple connection string of the form:
// postgresql://user:password@host:port/dbname
function parseConnectionString(str) {
    const regex = /^postgres(?:ql)?:\/\/(.+?):(.+?)@(.+?):(\d+)\/(.+)$/;
    const m = str.match(regex);
    if (!m) return null;
    return {
        user: m[1],
        password: m[2],
        host: m[3],
        port: parseInt(m[4], 10),
        database: m[5]
    };
}
// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function ensureDatabaseAndSchema() {
    const conn = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/mlc_db';
    const cfg = parseConnectionString(conn);
    if (!cfg) {
        console.error('[DB INIT] Unable to parse DATABASE_URL:', conn);
        process.exit(1);
    }

    // first connect to the maintenance database (postgres) to create the target database if missing
    const maintenancePool = new Pool({
        user: cfg.user,
        password: cfg.password,
        host: cfg.host,
        port: cfg.port,
        database: 'postgres'
    });

    try {
        await maintenancePool.query(`CREATE DATABASE "${cfg.database}"`);
        console.log(`[DB INIT] Database "${cfg.database}" created`);
    } catch (err) {
        if (err.code === '42P04') {
            console.log(`[DB INIT] Database "${cfg.database}" already exists`);
        } else {
            console.error('[DB INIT] Error creating database', err);
        }
    } finally {
        await maintenancePool.end();
    }

    // now apply schema to the target database
    const targetPool = new Pool({
        user: cfg.user,
        password: cfg.password,
        host: cfg.host,
        port: cfg.port,
        database: cfg.database
    });

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        await targetPool.query(sql);
        console.log('[DB INIT] Schema applied successfully');
    } catch (err) {
        console.error('[DB INIT] Error applying schema', err);
    } finally {
        await targetPool.end();
    }
}

// ESM-compatible main check
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
    ensureDatabaseAndSchema()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('[DB INIT] Fatal error', err);
            process.exit(1);
        });
}
