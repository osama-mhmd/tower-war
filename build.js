import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import * as fs from "fs";
import * as path from "path";

const resources = [];

const assetsDir = path.resolve(__dirname, "public/textures");
const output = path.resolve(__dirname, "src/build/resources.json");

console.log("Loading files from: ", assetsDir);

fs.readdir(assetsDir, (err, files) => {
  if (err) {
    console.log("Error reading files");
    process.exit(1);
  }

  console.log("Done ✅");

  resources.push(...files);
  fs.writeFileSync(output, JSON.stringify(resources));
});
