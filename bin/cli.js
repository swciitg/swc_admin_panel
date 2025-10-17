#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { generateProject } from '../index.js';

import { setupTailwind } from "../lib/setupTailwind.js";
import logger from '../lib/logger.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const projectRoot = process.cwd(); // the project where package is installed
  const modelsPath = path.join(projectRoot, 'models');

  if (!fs.existsSync(modelsPath)) {
    await logger.error('No models directory found in the project root for mongo schemas.');
    process.exit(1);
  }

  // fecthing the models files from the project root directory/models which end with .ts or .js
  const modelFiles = fs.readdirSync(modelsPath)
    .filter(file => file.endsWith('.js') || file.endsWith('.ts'))
    .map(file => file.replace(/\.[jt]s$/, ''));

  if (modelFiles.length === 0) {
    await logger.error('No models found inside the "models" folder.');
    process.exit(1);
  }

  const adminPanelPath = path.join(projectRoot, 'admin-panel');

  if (fs.existsSync(adminPanelPath)) {
    await logger.error('"admin-panel" folder already exists. Delete or rename it first.');
    process.exit(1);
  }
  await logger.info("Generating admin panel...");
  await generateProject({
    projectPath: adminPanelPath,
    models: modelFiles,
    projectRoot
  });
  await logger.info("Setting up Tailwind CSS...");
  await setupTailwind(adminPanelPath);
  await logger.info("Admin panel ready with Tailwind configured!");
}

main();
