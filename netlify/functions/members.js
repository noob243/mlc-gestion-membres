import { createClient } from '@supabase/supabase-js';

// Initialiser Supabase avec les variables d'environnement
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables d\'environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/members - Récupérer tous les membres
async function getMembers() {
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('registration_date', { ascending: false });

        if (error) {
            console.error('Erreur Supabase:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Erreur lors de la récupération des membres' })
            };
        }

        // Map snake_case → camelCase
        const members = data.map(row => ({
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

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(members)
        };
    } catch (err) {
        console.error('Erreur serveur:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur serveur' })
        };
    }
}

// POST /api/members - Créer un nouveau membre
async function createMember(member) {
    try {
        const { data, error } = await supabase
            .from('members')
            .insert([
                {
                    id: member.id,
                    last_name: member.lastName,
                    post_name: member.postName,
                    first_name: member.firstName,
                    sexe: member.sexe,
                    birth_date: member.birthDate,
                    country: member.country,
                    city_province: member.cityProvince,
                    category: member.category,
                    federation: member.federation,
                    phone: member.phone,
                    email: member.email,
                    registration_date: member.registrationDate,
                    photo_url: member.photoUrl
                }
            ])
            .select();

        if (error) {
            console.error('Erreur Supabase:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Erreur lors de l\'enregistrement' })
            };
        }

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, data: data[0] })
        };
    } catch (err) {
        console.error('Erreur serveur:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur serveur lors de l\'enregistrement' })
        };
    }
}

// Handler principal pour Netlify Functions
export async function handler(event, context) {
    // CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            return await getMembers();
        } else if (event.httpMethod === 'POST') {
            const member = JSON.parse(event.body);
            return await createMember(member);
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Méthode non autorisée' })
            };
        }
    } catch (err) {
        console.error('Erreur handler:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur interne du serveur' })
        };
    }
}
