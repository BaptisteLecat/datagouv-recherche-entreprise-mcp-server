#!/usr/bin/env node

import { RechercheEntrepriseServer } from './server.js';

async function main() {
  const server = new RechercheEntrepriseServer();
  await server.start();
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});