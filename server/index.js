import express from 'express';
import cors from 'cors';
import * as db from './db.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// __dirname hack for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// attempt to apply schema on every server start (harmless if table already exists)
async function applySchema() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await db.query(sql);
        console.log('[DB] Schéma appliqué / vérifié');
    } catch (err) {
        console.error('[DB] Impossible d\'appliquer le schéma', err);
    }
}
applySchema();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 photos

// API Endpoints

// GET all members
app.get('/api/members', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM members ORDER BY registration_date DESC');
        // Map database snake_case to frontend camelCase
        const members = result.rows.map(row => ({
            id: row.id,
            lastName: row.last_name,
            postName: row.post_name,
            firstName: row.first_name,
            sexe: row.sexe,
            birthDate: row.birth_date,
            country: row.country,
            cityProvince: row.city_province,
            category: row.category,
            federation: row.federation,
            phone: row.phone,
            email: row.email,
            registrationDate: row.registration_date,
            photoUrl: row.photo_url
        }));
        res.json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des membres' });
    }
});

// POST new member
app.post('/api/members', async (req, res) => {
    const m = req.body;
    try {
        const query = `
      INSERT INTO members (
        id, last_name, post_name, first_name, sexe, birth_date, 
        country, city_province, category, federation, phone, 
        email, registration_date, photo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
        const values = [
            m.id, m.lastName, m.postName, m.firstName, m.sexe, m.birthDate,
            m.country, m.cityProvince, m.category, m.federation, m.phone,
            m.email, m.registrationDate, m.photoUrl
        ];
        await db.query(query, values);
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement' });
    }
});

app.listen(PORT, () => {
    console.log(`[SERVER] Serveur backend démarré sur le port ${PORT}`);
});
