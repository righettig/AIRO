const fs = require('fs');
const path = require('path');

// Environment variables
const authApiUrl = process.env.AUTH_API_URL;
const adminApiUrl = process.env.ADMIN_API_URL;
const botsApiUrl = process.env.BOTS_API_URL;
const behavioursApiUrl = process.env.BEHAVIOURS_API_URL;
const anymalApiUrl = process.env.ANYMAL_API_URL;

// JSON content
const config = {
  authApiUrl,
  adminApiUrl,
  botsApiUrl,
  behavioursApiUrl,
  anymalApiUrl
};

// Path to write the JSON file
const outputPath = path.join(__dirname, 'public/env-config.json');

// Write the file
fs.writeFileSync(outputPath, JSON.stringify(config, null, 2), 'utf8');

console.log(`env-config.json has been generated at ${outputPath}`);
