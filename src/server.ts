import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve a simple static frontend (if present in /public)
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));

// Basic API root fallback — serve UI if available, otherwise JSON
app.get('/', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  try {
    return res.sendFile(indexPath);
  } catch (err) {
    return res.json({ message: 'Welcome to SAMPOU API' });
  }
});

// (Optional) internal endpoint to trigger migrations from the UI.
// WARNING: keep this protected in production. Here it's only for convenience.
app.post('/internal/run-migrations', async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(400).send('DATABASE_URL not configured');
  }
  try {
    // spawn a child process to run the npm script
    const { exec } = await import('child_process');
    exec('npm run db:migrate', { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) {
        res.status(500).send('Migration failed: ' + stderr || err.message);
      } else {
        res.send('Migrations run successfully:\n' + stdout);
      }
    });
  } catch (err: any) {
    res.status(500).send(err.message || String(err));
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});