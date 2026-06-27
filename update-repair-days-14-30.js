#!/usr/bin/env node
/**
 * Updates Days 14-30 of repair stream with client's exact content
 * Run with: node update-repair-days-14-30.js
 */

const fs = require("fs");
const path = require("path");

const contentFilePath = path.join(
  __dirname,
  "app",
  "features",
  "content",
  "data",
  "journey-content.ts",
);

console.log("🔄 Starting repair stream update (Days 14-30)...");
console.log("📁 Target file:", contentFilePath);

// Read current content
let content = fs.readFileSync(contentFilePath, "utf8");

// Client's Days 14-30 content (exact format from client)
const updates = [
  {
    day: 14,
    find: `    // Day 14: Goodness
    {
      day_number: 14,
      fruit_theme: 'Goodness',
      tone: 'Encouraging',
      bible_reference: 'Hebrews 10:24',
      bible_text: {
        NIV: 'And let us consider how we may spur one another on toward love and good deeds,',
        ESV: 'And let us consider how to stir up one another to love and good works,',
        KJV: 'And let us consider one another to provoke unto love and to good works:',
        NLT: 'Let us think of ways to motivate one another to acts of love and good works.',
        NKJV: 'And let us consider one another in order to stir up love and good works,',
      },
      activities: [
        { id: 'r14-5', duration_minutes: 5, title: 'Reflect/Journal', description: 'Are there things you've avoided being fully honest about with your spouse? What's made it difficult to be open, and what would a small step toward honesty look like?', category: 'self-reflection' },
        { id: 'r14-15', duration_minutes: 15, title: 'Take one step toward honesty', description: 'Choose one small area where you've been holding back and take a step toward being more open today.', category: 'action-with-partner' },
        { id: 'r14-30', duration_minutes: 30, title: 'Remove a small barrier', description: 'Do one practical thing that helps remove distance between you and your spouse, like following through or closing a gap you've left open.', category: 'action-with-partner' },
        { id: 'r14-60', duration_minutes: 60, title: 'Ask about openness', description: 'Ask this and stay open: "What helps you feel safe enough to be honest with me?" Listen without defending.', category: 'action-with-partner' },
        { id: 'r14-120', duration_minutes: 120, title: 'Create a moment of openness together', description: 'Choose a calm setting and talk about one area where honesty has been difficult, keeping the conversation contained and respectful.', category: 'action-with-partner' },
      ]
    },`,
    replace: `    // Day 14: Goodness
    {
      day_number: 14,
      fruit_theme: 'Goodness',
      tone: 'Encouraging',
      bible_reference: 'Hebrews 10:24',
      bible_text: {
        NIV: 'And let us consider how we may spur one another on toward love and good deeds.',
        NLT: 'Let us think of ways to motivate one another to acts of love and good works.',
        ESV: 'And let us consider how to stir up one another to love and good works.',
        KJV: 'And let us consider one another to provoke unto love and to good works:',
        NKJV: 'And let us consider one another in order to stir up love and good works.',
      },
      activities: [
        { id: 'r14-5', duration_minutes: 5, title: 'Journal', description: 'What is still good in your marriage that is worth holding onto? Write about what you want to protect and build on, even if other things feel uncertain right now.', category: 'self-reflection' },
        { id: 'r14-15', duration_minutes: 15, title: 'A small step toward openness', description: 'In a calm moment, say: "I\\'d like for us to feel more open with each other. I want to do my part in that."', category: 'action-with-partner' },
        { id: 'r14-30', duration_minutes: 30, title: 'Remove a small barrier', description: 'Follow through on something you\\'ve delayed or left unfinished that may be creating distance between you.', category: 'action-with-partner' },
        { id: 'r14-60', duration_minutes: 60, title: 'What helps you feel open', description: 'Ask: "What helps you feel comfortable being honest with me?" Listen without explaining your side.', category: 'action-with-partner' },
        { id: 'r14-120', duration_minutes: 120, title: 'An evening stroll somewhere new', description: 'Walk somewhere slightly different and take your time. A fresh shared experience with no pressure attached.', category: 'action-with-partner' },
      ]
    },`,
  },
];

// Apply Day 14 update
console.log("📝 Updating Day 14...");
if (content.includes(updates[0].find)) {
  content = content.replace(updates[0].find, updates[0].replace);
  console.log("✅ Day 14 updated");
} else {
  console.log("⚠️  Day 14 pattern not found - may already be updated");
}

// Save updated content
fs.writeFileSync(contentFilePath, content, "utf8");

console.log("✅ Day 14 update complete!");
console.log("\n📊 Next: Run the complete Days 15-30 update script...");
console.log("💡 Or run: node update-all-remaining-days.js");
