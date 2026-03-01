
import { Member, CentralDatabase } from '../types';

// Détecter l'environnement (local ou production)
const API_URL = import.meta.env.DEV
  ? 'http://localhost:5000/api/members'
  : '/.netlify/functions/members';

export const dbService = {
  // Récupère les membres depuis Supabase via Netlify Functions (ou local)
  async getDatabase(): Promise<CentralDatabase> {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const members = await response.json();
      return {
        version: import.meta.env.DEV ? '1.0.0-DEV' : '1.0.0-SUPABASE',
        lastUpdated: new Date().toISOString(),
        members: Array.isArray(members) ? members : []
      };
    } catch (error) {
      console.error("Erreur de lecture API:", error);
      // Fallback: retourner une base vide
      return {
        version: '1.0.0-OFFLINE',
        lastUpdated: new Date().toISOString(),
        members: []
      };
    }
  },

  // Enregistre un membre dans Supabase via Netlify Functions (ou local)
  async saveMember(member: Member): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      return response.ok;
    } catch (error) {
      console.error("Erreur d'enregistrement API:", error);
      return false;
    }
  },

  // Synchronisation Cloud (maintenue pour compatibilité UI)
  async syncWithCloud(): Promise<{ success: boolean; count: number }> {
    const db = await this.getDatabase();
    return { success: true, count: db.members.length };
  }
};

