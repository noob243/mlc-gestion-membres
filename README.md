<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/06df1545-362e-4a81-84bb-254e23bc1eea

## Run Locally

**Prerequisites:**
- Node.js (18+ recommended)
- PostgreSQL installed and running locally (or accessible via a connection URL)

1. Clone the repository and open the workspace.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Prepare the PostgreSQL database. You have two options:
   - **Local installation** – make sure a PostgreSQL server is running and accessible. Update `.env.local` with a connection string such as:
     ```env
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mlc_db
     PORT=5000
     ```
   - **Docker** – use the provided `docker-compose.yml` to start a container:
     ```bash
     docker-compose up -d
     ```
     The service will expose port 5432 and create the `mlc_db` database automatically.
4. Initialize the schema (the script is idempotent):
   ```bash
   npm run init-db
   ```
5. Start both frontend and backend concurrently:
   ```bash
   npm run start
   ```

The web UI will be available at `http://localhost:5173` (Vite default) and the server API at `http://localhost:5000/api`.

> **Note:** the init script uses the connection string to create the database and the
> `members` table if they are missing. Ensure PostgreSQL is running and that the
> user has permission to create databases.
