import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'upbeat-pattern-t01dl';
try {
  const configPath = path.resolve(__dirname, '../../firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);
    if (config.projectId) {
      projectId = config.projectId;
    }
  }
} catch (e) {
  console.warn('Could not read firebase-applet-config.json, using default projectId:', e);
}

if (!getApps().length) {
  initializeApp({
    projectId,
  });
}

export const adminAuth = getAuth();
