/**
 * Script to replace repair stream content with client's data
 * Run with: node apply-client-content.js
 */

const fs = require("fs");
const path = require("path");

// Path to journey-content.ts
const contentFile = path.join(
  __dirname,
  "app",
  "features",
  "content",
  "data",
  "journey-content.ts",
);

console.log("Starting content replacement...");
console.log("Target file:", contentFile);

// Read current content
const currentContent = fs.readFileSync(contentFile, "utf8");

// Find repair section boundaries
const repairStart = currentContent.indexOf("  repair: [");
const repairEnd = currentContent.indexOf("  ]\n,\n  family: [");

if (repairStart === -1 || repairEnd === -1) {
  console.error("Could not find repair section boundaries!");
  process.exit(1);
}

console.log(`Found repair section: lines ${repairStart} to ${repairEnd}`);
console.log("Client has provided 30 days of new content");
console.log("\nIMPORTANT: This script template is ready");
console.log(
  "To complete: Add all 30 days of client data to the newRepairSection variable",
);
console.log("Then run: node apply-client-content.js");

// TODO: Add complete newRepairSection content here
// For now, just show what would be replaced
const beforeRepair = currentContent.substring(0, repairStart);
const afterRepair = currentContent.substring(repairEnd + 3);

console.log("\nReady to replace:");
console.log(`- Before repair: ${beforeRepair.length} chars`);
console.log(`- Repair section: ${repairEnd - repairStart} chars`);
console.log(`- After repair: ${afterRepair.length} chars`);
