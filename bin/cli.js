#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { generateProject } from '../index.js';
import logger from '../lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const projectRoot = process.cwd(); // the project where package is installed
  const modelsPath = path.join(projectRoot, 'models');

  if (!fs.existsSync(modelsPath)) {
    console.error('No models directory found in the project root for mongo schemas.');
    await logger.error('No models directory found in the project root.', { projectRoot });
    process.exit(1);
  }

  // fetching the models files from the project root directory/models which end with .ts or .js
  const modelFiles = fs.readdirSync(modelsPath)
    .filter(file => file.endsWith('.js') || file.endsWith('.ts'))
    .map(file => file.replace(/\.[jt]s$/, ''));

  if (modelFiles.length === 0) {
    console.error('No models found inside the "models" folder.');
    await logger.warn('No model files found in the "models" folder.', { modelsPath });
    process.exit(1);
  }

  const adminPanelPath = path.join(projectRoot, 'admin-panel');

  if (fs.existsSync(adminPanelPath)) {
    console.error('"admin-panel" folder already exists. Delete or rename it first.');
    await logger.warn('"admin-panel" folder already exists.', { adminPanelPath });
    process.exit(1);
  }

  await logger.info('Starting admin panel generation...', { adminPanelPath, models: modelFiles });

  await generateProject({
    projectPath: adminPanelPath,
    models: modelFiles,
    projectRoot
  });

  await logger.info('Admin panel generation completed successfully.', { adminPanelPath });
}

main().catch(async (err) => {
  console.error(err);
  await logger.error('Unexpected error occurred while generating admin panel.', { error: err.message });
  process.exit(1);
});
