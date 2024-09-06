const fs = require('fs');
const path = require('path');

// Environment variables
const authApiUrl = process.env.AUTH_API_URL;

// JSON content
const config = {
  authApiUrl,
};

// Path to write the JSON file
const outputPath = path.join(__dirname, 'public/env-config.json');

// Write the file
fs.writeFileSync(outputPath, JSON.stringify(config, null, 2), 'utf8');

console.log(`env-config.json has been generated at ${outputPath}`);
