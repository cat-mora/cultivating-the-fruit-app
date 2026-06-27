#!/usr/bin/env node
/**
 * Complete Repair Stream Update - Days 14-30
 * Updates all remaining repair stream days with client's exact content
 *
 * Usage: node complete-repair-update.js
 */

const fs = require("fs");
const path = require("path");

const contentFile = path.join(
  __dirname,
  "app",
  "features",
  "content",
  "data",
  "journey-content.ts",
);

console.log("🚀 Starting complete repair stream update (Days 14-30)...\n");

// Read current content
let content = fs.readFileSync(contentFile, "utf8");
let updateCount = 0;

// All client data for Days 14-30
const clientDays = `    // Day 14: Goodness
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
    },
    // Day 15: Kindness
    {
      day_number: 15,
      fruit_theme: 'Kindness',
      tone: 'Gentle',
      bible_reference: '1 Peter 3:8',
      bible_text: {
        NIV: 'Finally, all of you, be like-minded, be sympathetic, love one another, be compassionate and humble.',
        NLT: 'Finally, all of you should be of one mind. Sympathize with each other. Love each other as brothers and sisters. Be tenderhearted, and keep a humble attitude.',
        ESV: 'Finally, all of you, have unity of mind, sympathy, brotherly love, a tender heart, and a humble mind.',
        KJV: 'Finally, be ye all of one mind, having compassion one of another, love as brethren, be pitiful, be courteous:',
        NKJV: 'Finally, all of you be of one mind, having compassion for one another; love as brothers, be tenderhearted, be courteous;',
      },
      activities: [
        { id: 'r15-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God restores tenderness in you. Ask that your spouse feels cared for even in imperfect moments. Pray for grace to rebuild on truth rather than pretending things are fine.', category: 'self-reflection' },
        { id: 'r15-15', duration_minutes: 15, title: 'Say something humble', description: 'Say gently: "I know I don\\'t always get this right, but I do care about us."', category: 'action-with-partner' },
        { id: 'r15-30', duration_minutes: 30, title: 'Show care despite how you feel', description: 'Do something kind for your spouse today regardless of your mood. Choose the action before the feeling follows.', category: 'action-for-partner' },
        { id: 'r15-60', duration_minutes: 60, title: 'What makes things feel harder', description: 'Ask: "What tends to make things feel more difficult between us?" One example each. No blame, no defence.', category: 'action-with-partner' },
        { id: 'r15-120', duration_minutes: 120, title: 'Visit a neutral place', description: 'Go to a café, park or bookstore together. Easy company in a calm setting with no expectations.', category: 'action-with-partner' },
      ]
    },
    // Day 16: Peace
    {
      day_number: 16,
      fruit_theme: 'Peace',
      tone: 'Encouraging',
      bible_reference: 'Matthew 5:9',
      bible_text: {
        NIV: 'Blessed are the peacemakers, for they will be called children of God.',
        NLT: 'God blesses those who work for peace, for they will be called the children of God.',
        ESV: 'Blessed are the peacemakers, for they shall be called sons of God.',
        KJV: 'Blessed are the peacemakers: for they shall be called the children of God.',
        NKJV: 'Blessed are the peacemakers, for they shall be called sons of God.',
      },
      activities: [
        { id: 'r16-5', duration_minutes: 5, title: 'Reflect', description: 'Where have you had the chance to bring peace into your marriage recently and taken it? Where have you missed it? What would one peacemaking choice look like today?', category: 'self-reflection' },
        { id: 'r16-15', duration_minutes: 15, title: 'Say one peaceful sentence', description: 'When things feel tense, say: "I don\\'t want this to turn into something between us." Say it and let it land.', category: 'action-with-partner' },
        { id: 'r16-30', duration_minutes: 30, title: 'Do one thing that restores calm', description: 'Lower noise, reduce clutter, or create a calmer space in one small practical way.', category: 'action-with-partner' },
        { id: 'r16-60', duration_minutes: 60, title: 'What brings you peace with me', description: 'Ask: "What helps you feel peaceful with me?" Keep answers short and grounded in the everyday.', category: 'action-with-partner' },
        { id: 'r16-120', duration_minutes: 120, title: 'A music night', description: 'Play music you both enjoy or used to love and sit together. Let shared atmosphere do the work.', category: 'action-with-partner' },
      ]
    },
    // Day 17: Faithfulness
    {
      day_number: 17,
      fruit_theme: 'Faithfulness',
      tone: 'Gentle',
      bible_reference: 'Proverbs 20:6',
      bible_text: {
        NIV: 'Many claim to have unfailing love, but a faithful person who can find?',
        NLT: 'Many will say they are loyal friends, but who can find one who is truly reliable?',
        ESV: 'Many a man proclaims his own steadfast love, but a faithful man who can find?',
        KJV: 'Most men will proclaim every one his own goodness: but a faithful man who can find?',
        NKJV: 'Most men will proclaim each his own goodness, but who can find a faithful man?',
      },
      activities: [
        { id: 'r17-5', duration_minutes: 5, title: 'Journal', description: 'Faithfulness shows up in small things first. Write about one area where you could be more consistent toward your spouse this week. What would that look like in practice?', category: 'self-reflection' },
        { id: 'r17-15', duration_minutes: 15, title: 'Reinforce trust in words', description: 'Say something simple: "I want to be someone you can rely on."', category: 'action-with-partner' },
        { id: 'r17-30', duration_minutes: 30, title: 'Remove one source of doubt', description: 'Be consistent in one small action today so your spouse experiences your reliability rather than just hears about it.', category: 'action-for-partner' },
        { id: 'r17-60', duration_minutes: 60, title: 'What helps you feel secure', description: 'Ask: "What helps you feel safe and secure in our relationship?" Listen without reacting or defending.', category: 'action-with-partner' },
        { id: 'r17-120', duration_minutes: 120, title: 'Plan something to look forward to', description: 'Choose a simple future plan — a meal, an outing — and talk it through. Build a small sense of shared direction.', category: 'action-with-partner' },
      ]
    },
    // Day 18: Goodness
    {
      day_number: 18,
      fruit_theme: 'Goodness',
      tone: 'Gentle',
      bible_reference: 'Luke 6:31',
      bible_text: {
        NIV: 'Do to others as you would have them do to you.',
        NLT: 'Do to others as you would like them to do to you.',
        ESV: 'And as you wish that others would do to you, do so to them.',
        KJV: 'And as ye would that men should do to you, do ye also to them likewise.',
        NKJV: 'And just as you want men to do to you, you also do to them likewise.',
      },
      activities: [
        { id: 'r18-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God helps you treat your spouse the way you want to be treated. Ask for grace to act with kindness even when it feels one-sided. Pray for growing trust between you.', category: 'self-reflection' },
        { id: 'r18-15', duration_minutes: 15, title: 'Match your tone to your values', description: 'In your next conversation, choose a response like "I understand" or "That makes sense" to keep things steady.', category: 'action-with-partner' },
        { id: 'r18-30', duration_minutes: 30, title: 'One fair and thoughtful act', description: 'Choose an action that shows fairness — share a task evenly or take your turn without being asked.', category: 'action-with-partner' },
        { id: 'r18-60', duration_minutes: 60, title: 'A moment we could revisit', description: 'Ask: "Was there a recent moment we could have handled more gently?" One example each, no blame attached.', category: 'action-with-partner' },
        { id: 'r18-120', duration_minutes: 120, title: 'A game or quiz night', description: 'Find a YouTube quiz — music, movies, trivia — and play along. The aim is to laugh and feel easy with each other.', category: 'action-with-partner' },
      ]
    },
    // Day 19: Kindness
    {
      day_number: 19,
      fruit_theme: 'Kindness',
      tone: 'Gentle',
      bible_reference: 'Ephesians 4:32',
      bible_text: {
        NIV: 'Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.',
        NLT: 'Instead, be kind to each other, tenderhearted, forgiving one another, just as God through Christ has forgiven you.',
        ESV: 'Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.',
        KJV: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\\'s sake hath forgiven you.',
        NKJV: 'And be kind to one another, tenderhearted, forgiving one another, even as God in Christ forgave you.',
      },
      activities: [
        { id: 'r19-5', duration_minutes: 5, title: 'Pray', description: 'Pray that the forgiveness God has shown you becomes something you can extend today. Ask for a tender heart toward your spouse. Pray that kindness comes more easily between you.', category: 'self-reflection' },
        { id: 'r19-15', duration_minutes: 15, title: 'Acknowledge your tone', description: 'In a natural moment, say: "I\\'ve noticed I\\'ve been a bit short lately. I don\\'t want that between us."', category: 'action-with-partner' },
        { id: 'r19-30', duration_minutes: 30, title: 'One kind act regardless', description: 'Choose one simple kind action today regardless of your mood. Let the action lead.', category: 'action-for-partner' },
        { id: 'r19-60', duration_minutes: 60, title: 'Something small to release', description: 'Ask gently: "Is there anything small we can let go of today?" Keep it light and contained.', category: 'action-with-partner' },
        { id: 'r19-120', duration_minutes: 120, title: 'Get takeaway, change location', description: 'Pick up takeaway and eat somewhere different — a park, outside. Shift the environment and keep things fresh.', category: 'action-with-partner' },
      ]
    },
    // Day 20: Love
    {
      day_number: 20,
      fruit_theme: 'Love',
      tone: 'Encouraging',
      bible_reference: '1 John 4:7',
      bible_text: {
        NIV: 'Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God.',
        NLT: 'Dear friends, let us continue to love one another, for love comes from God. Anyone who loves is a child of God and knows God.',
        ESV: 'Beloved, let us love one another, for love is from God, and whoever loves has been born of God and knows God.',
        KJV: 'Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God.',
        NKJV: 'Beloved, let us love one another, for love is of God; and everyone who loves is born of God and knows God.',
      },
      activities: [
        { id: 'r20-5', duration_minutes: 5, title: 'Journal', description: 'Love comes from God, which means you can ask Him for more of it. Write about where love feels thin right now and what it would look like to bring God into that specific place.', category: 'self-reflection' },
        { id: 'r20-15', duration_minutes: 15, title: 'Choose a loving phrase', description: 'Say something simple: "I do love you, even when things feel off between us."', category: 'action-with-partner' },
        { id: 'r20-30', duration_minutes: 30, title: 'One loving act', description: 'Do one small thing that clearly shows care — make something, help with something, do something thoughtful for them today.', category: 'action-with-partner' },
        { id: 'r20-60', duration_minutes: 60, title: 'What has been working', description: 'Ask: "What\\'s one thing that has felt better between us lately?" One answer each. Stay focused on what is moving in the right direction.', category: 'action-with-partner' },
        { id: 'r20-120', duration_minutes: 120, title: 'Sit together and share space', description: 'Watch something or listen to music in the same room, no phones. No pressure for conversation. Just being in the same space counts.', category: 'action-with-partner' },
      ]
    },
    // Day 21: Patience
    {
      day_number: 21,
      fruit_theme: 'Patience',
      tone: 'Gentle',
      bible_reference: 'Proverbs 14:29',
      bible_text: {
        NIV: 'Whoever is patient has great understanding, but one who is quick-tempered displays folly.',
        NLT: 'People with understanding control their anger; a hot temper shows great foolishness.',
        ESV: 'Whoever is slow to anger has great understanding, but he who has a hasty temper exalts folly.',
        KJV: 'He that is slow to wrath is of great understanding: but he that is hasty of spirit exalteth folly.',
        NKJV: 'He who is slow to wrath has great understanding, but he who is impulsive exalts folly.',
      },
      activities: [
        { id: 'r21-5', duration_minutes: 5, title: 'Journal', description: 'Where does impatience show up most in your marriage? Write about what is usually underneath it — and what one steadier response could look like this week.', category: 'self-reflection' },
        { id: 'r21-15', duration_minutes: 15, title: 'Say something calming', description: 'Say gently: "We\\'ll be okay. I\\'d like us to work through things calmly."', category: 'action-with-partner' },
        { id: 'r21-30', duration_minutes: 30, title: 'Do one thing that creates calm', description: 'Handle one situation today in a slower, calmer way than you normally would.', category: 'action-with-partner' },
        { id: 'r21-60', duration_minutes: 60, title: 'What has felt frustrating lately', description: 'Ask: "What\\'s one thing that\\'s been frustrating for you lately?" One answer each. Listen without fixing.', category: 'action-with-partner' },
        { id: 'r21-120', duration_minutes: 120, title: 'A calming activity together', description: 'Make tea, sit outside or listen to music side by side. Create a peaceful shared rhythm with no agenda.', category: 'action-with-partner' },
      ]
    },
    // Day 22: Unity
    {
      day_number: 22,
      fruit_theme: 'Unity',
      tone: 'Gentle',
      bible_reference: 'Genesis 2:24',
      bible_text: {
        NIV: 'That is why a man leaves his father and mother and is united to his wife, and they become one flesh.',
        NLT: 'This explains why a man leaves his father and mother and is joined to his wife, and the two are united into one.',
        ESV: 'Therefore a man shall leave his father and his mother and hold fast to his wife, and they shall become one flesh.',
        KJV: 'Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.',
        NKJV: 'Therefore a man shall leave his father and mother and be joined to his wife, and they shall become one flesh.',
      },
      activities: [
        { id: 'r22-5', duration_minutes: 5, title: 'Pray', description: 'Pray over the covenant you made. Ask God to remind you both what you are to each other. Pray that the bond between you grows stronger than the distance that has formed.', category: 'self-reflection' },
        { id: 'r22-15', duration_minutes: 15, title: 'Reconnect with something familiar', description: 'Say: "I was thinking about when we first got together — I really valued that time with you."', category: 'action-with-partner' },
        { id: 'r22-30', duration_minutes: 30, title: 'Recreate a small moment', description: 'Do something simple you used to do earlier in your relationship — make a drink, start a small routine, sit in a familiar spot.', category: 'action-with-partner' },
        { id: 'r22-60', duration_minutes: 60, title: 'One early memory', description: 'Ask: "What\\'s one memory from early on that stands out to you?" Stay in it and enjoy it together.', category: 'action-with-partner' },
        { id: 'r22-120', duration_minutes: 120, title: 'Revisit a familiar favourite', description: 'Return to a place or activity you both know. Reconnect through something that already belongs to you both.', category: 'action-with-partner' },
      ]
    },
    // Day 23: Peace
    {
      day_number: 23,
      fruit_theme: 'Peace',
      tone: 'Encouraging',
      bible_reference: 'Ecclesiastes 4:9–10',
      bible_text: {
        NIV: 'Two are better than one, because they have a good return for their labor. If either of them falls down, one can help the other up.',
        NLT: 'Two people are better off than one, for they can help each other succeed. If one person falls, the other can reach out and help.',
        ESV: 'Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow.',
        KJV: 'Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow.',
        NKJV: 'Two are better than one, because they have a good reward for their labor. For if they fall, one will lift up his companion.',
      },
      activities: [
        { id: 'r23-5', duration_minutes: 5, title: 'Journal', description: 'Where has your spouse needed support lately and you have given it? Where have you held back? Write about what showing up for each other looks like in this season.', category: 'self-reflection' },
        { id: 'r23-15', duration_minutes: 15, title: 'Offer help directly', description: 'Say: "What\\'s one thing I could help you with today?" Leave it open and mean it.', category: 'action-with-partner' },
        { id: 'r23-30', duration_minutes: 30, title: 'Lighten their load', description: 'Take over one responsibility your spouse is carrying so they feel the practical difference of having you on their side.', category: 'action-with-partner' },
        { id: 'r23-60', duration_minutes: 60, title: 'What would feel like real support?', description: 'Ask: "What\\'s one thing that would make you feel genuinely supported by me right now?" Listen without pushing back or offering a different answer.', category: 'action-with-partner' },
        { id: 'r23-120', duration_minutes: 120, title: 'Turn errands into shared time', description: 'Run errands together and include a small treat or pause along the way. Bring connection into the ordinary.', category: 'action-with-partner' },
      ]
    },
    // Day 24: Faithfulness
    {
      day_number: 24,
      fruit_theme: 'Faithfulness',
      tone: 'Gentle',
      bible_reference: 'Proverbs 27:17',
      bible_text: {
        NIV: 'As iron sharpens iron, so one person sharpens another.',
        NLT: 'As iron sharpens iron, so a friend sharpens a friend.',
        ESV: 'Iron sharpens iron, and one man sharpens another.',
        KJV: 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.',
        NKJV: 'As iron sharpens iron, so a man sharpens the countenance of his friend.',
      },
      activities: [
        { id: 'r24-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God builds faithfulness and openness in you. Ask that your spouse feels secure enough to be honest with you. Pray for a marriage where both of you make each other better.', category: 'self-reflection' },
        { id: 'r24-15', duration_minutes: 15, title: 'Invite openness gently', description: 'Say: "If something\\'s been sitting with you, I\\'m open to hearing it."', category: 'action-with-partner' },
        { id: 'r24-30', duration_minutes: 30, title: 'Respond with openness in action', description: 'Do one small action that shows flexibility — follow through, adjust something, be more willing than usual.', category: 'action-with-partner' },
        { id: 'r24-60', duration_minutes: 60, title: 'One thing we could do better', description: 'Ask: "What\\'s one small thing we could do better as a couple?" Stay focused on solutions, not history.', category: 'action-with-partner' },
        { id: 'r24-120', duration_minutes: 120, title: 'A simple at-home evening', description: 'Set up snacks or drinks and spend the evening together without a plan. If you have kids, this works well after bedtime.', category: 'action-with-partner' },
      ]
    },
    // Day 25: Love
    {
      day_number: 25,
      fruit_theme: 'Love',
      tone: 'Encouraging',
      bible_reference: 'Colossians 3:14',
      bible_text: {
        NIV: 'And over all these virtues put on love, which binds them all together in perfect unity.',
        NLT: 'Above all, clothe yourselves with love, which binds us all together in perfect harmony.',
        ESV: 'And above all these put on love, which binds everything together in perfect harmony.',
        KJV: 'And above all these things put on charity, which is the bond of perfectness.',
        NKJV: 'But above all these things put on love, which is the bond of perfection.',
      },
      activities: [
        { id: 'r25-5', duration_minutes: 5, title: 'Reflect', description: 'Love is described here as something you put on — a daily choice, not just a feeling. Where have you chosen it recently? Where have you avoided it? What would choosing it look like today?', category: 'self-reflection' },
        { id: 'r25-15', duration_minutes: 15, title: 'Say something to release tension', description: 'Say: "I don\\'t want us holding onto small things. I\\'d rather keep things light between us where we can."', category: 'action-with-partner' },
        { id: 'r25-30', duration_minutes: 30, title: 'Show love through a small act', description: 'Do one small practical thing that shows care and kindness toward your spouse today.', category: 'action-with-partner' },
        { id: 'r25-60', duration_minutes: 60, title: 'Something small to release', description: 'Ask gently: "Is there something small we can let go of today?" Keep it simple and contained.', category: 'action-with-partner' },
        { id: 'r25-120', duration_minutes: 120, title: 'Reset the mood together', description: 'Step outside, change rooms, or shift the setting. Begin the evening again with a lighter tone.', category: 'action-with-partner' },
      ]
    },
    // Day 26: Self-control
    {
      day_number: 26,
      fruit_theme: 'Self-control',
      tone: 'Gentle',
      bible_reference: 'Proverbs 18:13',
      bible_text: {
        NIV: 'To answer before listening—that is folly and shame.',
        NLT: 'Spouting off before listening to the facts is both shameful and foolish.',
        ESV: 'If one gives an answer before he hears, it is his folly and shame.',
        KJV: 'He that answereth a matter before he heareth it, it is folly and shame unto him.',
        NKJV: 'He who answers a matter before he hears it, it is folly and shame to him.',
      },
      activities: [
        { id: 'r26-5', duration_minutes: 5, title: 'Journal', description: 'Think about the last conversation with your spouse where you responded before they had finished. What were you actually reacting to? What would full listening have changed?', category: 'self-reflection' },
        { id: 'r26-15', duration_minutes: 15, title: 'Show you are listening', description: 'Say: "I do want to understand you better. I\\'m listening."', category: 'action-with-partner' },
        { id: 'r26-30', duration_minutes: 30, title: 'Listen through action', description: 'Put your phone away when your spouse is speaking today. Full attention is its own kind of respect.', category: 'action-with-partner' },
        { id: 'r26-60', duration_minutes: 60, title: 'Give them the floor', description: 'Ask: "Is there something you\\'d like me to hear more clearly?" Let them speak fully before you respond.', category: 'action-with-partner' },
        { id: 'r26-120', duration_minutes: 120, title: 'Chat then settle into something', description: 'Spend time talking about something light, then move into a show or activity together. Balance conversation with ease.', category: 'action-with-partner' },
      ]
    },
    // Day 27: Faithfulness
    {
      day_number: 27,
      fruit_theme: 'Faithfulness',
      tone: 'Encouraging',
      bible_reference: 'Proverbs 3:5–6',
      bible_text: {
        NIV: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
        NLT: 'Trust in the Lord with all your heart; do not depend on your own understanding. Seek his will in all you do, and he will show you which path to take.',
        ESV: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
        KJV: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
        NKJV: 'Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.',
      },
      activities: [
        { id: 'r27-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God directs your marriage where your own understanding has run out. Ask for the humility to trust Him with what you cannot fix. Pray for small signs of His faithfulness today.', category: 'self-reflection' },
        { id: 'r27-15', duration_minutes: 15, title: 'Acknowledge growth', description: 'Say: "I\\'m trying to do things differently, even in small ways. I want you to know that."', category: 'action-with-partner' },
        { id: 'r27-30', duration_minutes: 30, title: 'One visible change', description: 'Choose one small behaviour to change today and act on it. Let the change speak for itself.', category: 'self-reflection' },
        { id: 'r27-60', duration_minutes: 60, title: 'One habit to grow toward', description: 'Ask: "What\\'s one small thing we\\'d each like to move toward as a couple?" One answer each, forward-facing.', category: 'action-with-partner' },
        { id: 'r27-120', duration_minutes: 120, title: 'Easy conversation tonight', description: 'Choose topics like travel, food or "what would we do if" and keep it playful. Let the evening feel light.', category: 'action-with-partner' },
      ]
    },
    // Day 28: Peace
    {
      day_number: 28,
      fruit_theme: 'Peace',
      tone: 'Encouraging',
      bible_reference: 'Romans 15:5',
      bible_text: {
        NIV: 'May the God who gives endurance and encouragement give you the same attitude of mind toward each other that Christ Jesus had.',
        NLT: 'May God, who gives this patience and encouragement, help you live in complete harmony with each other, as is fitting for followers of Christ Jesus.',
        ESV: 'May the God of endurance and encouragement grant you to live in such harmony with one another, in accord with Christ Jesus.',
        KJV: 'Now the God of patience and consolation grant you to be likeminded one toward another according to Christ Jesus.',
        NKJV: 'Now may the God of patience and comfort grant you to be like-minded toward one another, according to Christ Jesus.',
      },
      activities: [
        { id: 'r28-5', duration_minutes: 5, title: 'Pray', description: 'Pray this verse over your marriage today. Ask God for the endurance to keep going and the encouragement to believe things can change. Pray for harmony that comes from Him, not just effort.', category: 'self-reflection' },
        { id: 'r28-15', duration_minutes: 15, title: 'Put them first in words', description: 'Say: "I want to be more aware of what you need. I\\'m working on that."', category: 'action-with-partner' },
        { id: 'r28-30', duration_minutes: 30, title: 'Support them visibly', description: 'Do something today that clearly shows your spouse they matter — especially in something that is important to them.', category: 'action-with-partner' },
        { id: 'r28-60', duration_minutes: 60, title: 'How can I support you better', description: 'Ask: "What\\'s one way I could support you better right now?" Receive the answer openly without defending.', category: 'action-with-partner' },
        { id: 'r28-120', duration_minutes: 120, title: 'Try something slightly new', description: 'Visit a new café, try a new snack, or explore somewhere unfamiliar. A small dose of novelty and shared discovery.', category: 'action-with-partner' },
      ]
    },
    // Day 29: Peace
    {
      day_number: 29,
      fruit_theme: 'Peace',
      tone: 'Encouraging',
      bible_reference: '2 Corinthians 13:11',
      bible_text: {
        NIV: 'Aim for restoration, comfort one another, agree with one another, live in peace.',
        NLT: 'Aim for harmony, comfort each other, and live in peace.',
        ESV: 'Aim for restoration, comfort one another, agree with one another, live in peace.',
        KJV: 'Be perfect, be of good comfort, be of one mind, live in peace.',
        NKJV: 'Become complete. Be of good comfort, be of one mind, live in peace.',
      },
      activities: [
        { id: 'r29-5', duration_minutes: 5, title: 'Pray', description: 'Pray for restoration in your marriage — not perfection, but movement toward each other. Ask God to bring comfort where there has been hurt. Pray that peace becomes the atmosphere between you.', category: 'self-reflection' },
        { id: 'r29-15', duration_minutes: 15, title: 'Say something that brings peace', description: 'Say gently: "I\\'d really like things to feel easier between us. I believe they can."', category: 'action-with-partner' },
        { id: 'r29-30', duration_minutes: 30, title: 'One comforting act', description: 'Do one small thing that brings comfort — make a drink, help with something they are handling, ease one thing for them.', category: 'action-with-partner' },
        { id: 'r29-60', duration_minutes: 60, title: 'What brings peace between us', description: 'Ask: "What helps you feel at peace in our relationship?" One or two answers each. Receive them well.', category: 'action-with-partner' },
        { id: 'r29-120', duration_minutes: 120, title: 'Wind down together', description: 'Spend the last part of the evening in the same space with low energy and easy conversation. End the day feeling settled.', category: 'action-with-partner' },
      ]
    },
    // Day 30: Peace
    {
      day_number: 30,
      fruit_theme: 'Peace',
      tone: 'Gentle',
      bible_reference: 'Psalm 147:3',
      bible_text: {
        NIV: 'He heals the brokenhearted and binds up their wounds.',
        NLT: 'He heals the brokenhearted and bandages their wounds.',
        ESV: 'He heals the brokenhearted and binds up their wounds.',
        KJV: 'He healeth the broken in heart, and bindeth up their wounds.',
        NKJV: 'He heals the brokenhearted and binds up their wounds.',
      },
      activities: [
        { id: 'r30-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God does what only He can do in your marriage. Thank Him for the ground you have covered. Ask Him to continue the healing — in you, in your spouse, and between you both.', category: 'self-reflection' },
        { id: 'r30-15', duration_minutes: 15, title: 'Speak hope over your marriage', description: 'Say: "I\\'m glad we are still here. I believe God is working in this."', category: 'action-with-partner' },
        { id: 'r30-30', duration_minutes: 30, title: 'Show repair through action', description: 'Do one practical thing that shows you care and want things to be better — follow through, ease something, show up well.', category: 'action-with-partner' },
        { id: 'r30-60', duration_minutes: 60, title: 'A simple shared acknowledgement', description: 'Say to each other: "One thing I have appreciated about you over these days is…" Keep it genuine and brief.', category: 'action-with-partner' },
        { id: 'r30-120', duration_minutes: 120, title: 'End with something calm', description: 'Spend the final part of the evening in the same space, unhurried. Let the day close with a sense of peace and arrival.', category: 'action-with-partner' },
      ]
    },`;

// Find the start of Day 14
const day14Start = content.indexOf("    // Day 14: Goodness");
if (day14Start === -1) {
  console.error("❌ Could not find Day 14 start marker");
  process.exit(1);
}

// Find the end of Day 30 (start of Day 31 or family section)
const day30End = content.indexOf("  ]\n,\n  family: [", day14Start);
if (day30End === -1) {
  console.error("❌ Could not find Day 30 end marker (family section)");
  process.exit(1);
}

// Replace Days 14-30
const beforeDay14 = content.substring(0, day14Start);
const afterDay30 = content.substring(day30End);

content = beforeDay14 + clientDays + "\n" + afterDay30;

// Write updated content
fs.writeFileSync(contentFile, content, "utf8");

console.log("✅ Complete! All Days 14-30 updated with client content\n");
console.log("📊 Summary:");
console.log("  - Days 1-13: Previously updated ✅");
console.log("  - Days 14-30: Just updated ✅");
console.log("  - Total: 30/30 days complete! 🎉\n");
console.log("🚀 Ready to test! Start your app with: cd app && npm start");
