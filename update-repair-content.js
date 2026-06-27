// Script to update repair stream content with client's data
const fs = require("fs");
const path = require("path");

// Client's repair stream data (S2-001 to S2-030)
const clientData = [
  {
    day: 1,
    verse: "Proverbs 15:1",
    niv: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
    nlt: "A gentle answer deflects anger, but harsh words make tempers flare.",
    esv: "A soft answer turns away wrath, but a harsh word stirs up anger.",
    kjv: "A soft answer turneth away wrath: but grievous words stir up anger.",
    nkjv: "A soft answer turns away wrath, but a harsh word stirs up anger.",
    fruit: "Gentleness",
    tone: "Gentle", // mapped from "Light Stretch"
    activities: [
      {
        title: "Pray",
        desc: "Pray for a softer heart today. Ask God to help your words land gently. Pray your spouse feels something shift, even in small ways. Ask for gentleness to come from Him, not just from effort.",
        cat: "self-reflection",
      },
      {
        title: "Say one gentle sentence",
        desc: 'Find a moment today to say: "I\'d love for things to feel calmer between us." Say it simply and leave it there.',
        cat: "action-with-partner",
      },
      {
        title: "Lower the load",
        desc: "Do one small task for your spouse without being asked. Make a drink, tidy something, handle one job. No announcement needed.",
        cat: "action-for-partner",
      },
      {
        title: "What helps you feel heard",
        desc: 'Ask: "What helps you feel heard when things are tense?" One answer each. If it feels charged, stop and come back later.',
        cat: "action-with-partner",
      },
      {
        title: "Walk somewhere easy",
        desc: "Go for a walk and keep the conversation light — a good memory, something you're looking forward to. Just be side by side.",
        cat: "action-with-partner",
      },
    ],
  },
  // ... rest of the 30 days would go here
];

// For now, let's just log that this script exists
console.log("Repair content update script ready");
console.log(`Would update ${clientData.length} days`);
