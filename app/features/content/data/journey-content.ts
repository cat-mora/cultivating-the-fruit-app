export type ActivityCategory = 'self-reflection' | 'action-for-partner' | 'action-with-partner';

export interface Activity {
  id: string;
  duration_minutes: number;
  title: string;
  description: string;
  category: ActivityCategory;
}

export interface DailyContent {
  day_number: number;
  fruit_theme: string;
  tone: 'Gentle' | 'Encouraging' | 'Challenging' | 'Passionate' | 'Light Stretch';
  bible_reference: string;
  bible_text: Record<string, string>;
  activities: Activity[];
}

export const JOURNEY_CONTENT: Record<string, DailyContent[]> = {
  strengthen: [
    // Day 1: Love
    {
      day_number: 1,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 1:2',
      bible_text: {
        NIV: 'Let him kiss me with the kisses of his mouth...for your love is more delightful than wine.',
        ESV: 'Let him kiss me with the kisses of his mouth! For your love is better than wine;',
        KJV: 'Let him kiss me with the kisses of his mouth: for thy love is better than wine.',
        NLT: 'Kiss me and kiss me again, for your love is sweeter than wine.',
        NKJV: 'Let him kiss me with the kisses of his mouth...For your love is better than wine.',
      },
      activities: [
        { id: 's1001-5', duration_minutes: 5, title: 'Reflect', description: 'Do you still long for closeness with your spouse, or have you let routine dull that desire? What would it look like to lean back into affection and passion?', category: 'self-reflection' },
        { id: 's1001-5b', duration_minutes: 5, title: 'Express desire for closeness', description: 'Tell your spouse: "I miss feeling really close to you." Say it gently and with genuine affection, not like an accusation.', category: 'self-reflection' },
        { id: 's1001-10', duration_minutes: 10, title: 'Send a cute message', description: 'Send your spouse a short message like, "I\'ve been thinking it would be nice to bring back a bit of our spark ... also, you still look pretty amazing to me." Keep it light and genuine.', category: 'action-for-partner' },
        { id: 's1001-20', duration_minutes: 20, title: 'Share one thing you appreciate', description: 'At some point, take turns sharing one thing you\'ve appreciated about each other lately. Keep it simple and receive it without brushing it off.', category: 'action-with-partner' },
        { id: 's1001-60', duration_minutes: 60, title: 'Recreate your first spark', description: 'Say, "I\'ve been thinking I miss how we used to feel." Recreate an early date at home with music and drinks. Ask a few "first date" questions, then sit closer, hold eye contact and if you feel comfortable, let it shift into touch and kissing.', category: 'action-with-partner' },
      ]
    },
    // Day 2: Kindness
    {
      day_number: 2,
      fruit_theme: 'Kindness',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 1:16',
      bible_text: {
        NIV: 'How handsome you are, my beloved! Oh, how charming! And our bed is verdant.',
        ESV: 'Behold, you are beautiful, my beloved, truly delightful. Our couch is green;',
        KJV: 'Behold, thou art fair, my beloved, yea, pleasant: also our bed is green.',
        NLT: 'How handsome you are, my lover, how charming! The soft grass is our bed.',
        NKJV: 'Behold, you are handsome, my beloved! Yes, pleasant! Also our bed is green.',
      },
      activities: [
        { id: 's1002-5', duration_minutes: 5, title: 'Journal', description: 'When was the last time your spouse truly stood out to you? What makes them different from everyone else in your eyes?', category: 'self-reflection' },
        { id: 's1002-5b', duration_minutes: 5, title: 'Let them know what sets them apart', description: 'Think of one thing that makes your spouse different from everyone else, and share it with them in a natural moment today. Keep it specific so they can really feel it.', category: 'self-reflection' },
        { id: 's1002-10', duration_minutes: 10, title: 'Do the thing you said you would', description: 'Think of one thing you told your spouse you would do. Then just do it.', category: 'action-for-partner' },
        { id: 's1002-20', duration_minutes: 20, title: 'Do a "remember when" moment', description: 'Take a few minutes to each share one memory from earlier in your relationship that you enjoyed. Keep it light and positive.', category: 'action-with-partner' },
        { id: 's1002-60', duration_minutes: 60, title: 'Admire and move closer', description: 'Say, "I want to feel closer than we have been for a while." Over dessert or drinks, take turns sharing 3 things you admire and find attractive. Move physically closer after each round and see where it leads you.', category: 'action-with-partner' },
      ]
    },
    // Day 3: Joy
    {
      day_number: 3,
      fruit_theme: 'Joy',
      tone: 'Passionate',
      bible_reference: 'Proverbs 5:18',
      bible_text: {
        NIV: 'May your fountain be blessed, and may you rejoice in the wife of your youth.',
        ESV: 'Let your fountain be blessed, and rejoice in the wife of your youth.',
        KJV: 'Let thy fountain be blessed: and rejoice with the wife of thy youth.',
        NLT: 'Let your wife be a fountain of blessing for you. Rejoice in the wife of your youth.',
        NKJV: 'Let your fountain be blessed, And rejoice with the wife of your youth.',
      },
      activities: [
        { id: 's1003-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would renew your heart toward your spouse, softening any distance in you. Pray that your spouse would feel loved, desired and valued. Pray that your marriage would grow in closeness, affection and connection.', category: 'self-reflection' },
        { id: 's1003-5b', duration_minutes: 5, title: 'Bring back something you love about them', description: 'Think back to earlier in your relationship and share one thing you loved about your spouse then that you still see now. Keep it simple and real.', category: 'self-reflection' },
        { id: 's1003-10', duration_minutes: 10, title: 'Bring home or make a small treat', description: 'Bring home or make something small your spouse enjoys and say something like, "I was thinking of you today, so I thought I\'d grab this." Keep it light.', category: 'action-for-partner' },
        { id: 's1003-20', duration_minutes: 20, title: 'Share what makes you feel valued', description: 'Take turns finishing this sentence: "I feel most valued when…"', category: 'action-with-partner' },
        { id: 's1003-60', duration_minutes: 60, title: 'Choose joy together', description: 'Say, "I want us to enjoy each other more again." Go for ice cream, a walk or play a fun quiz. Laugh, tease and stay out longer than usual or continue the night together at home.', category: 'action-with-partner' },
      ]
    },
    // Day 4: Kindness
    {
      day_number: 4,
      fruit_theme: 'Kindness',
      tone: 'Encouraging',
      bible_reference: 'Song of Solomon 1:15',
      bible_text: {
        NIV: 'How beautiful you are, my darling! Oh, how beautiful! Your eyes are doves.',
        ESV: 'Behold, you are beautiful, my love; behold, you are beautiful; your eyes are doves.',
        KJV: 'Behold, thou art fair, my love; behold, thou art fair; thou hast doves\' eyes.',
        NLT: 'How beautiful you are, my darling, how beautiful! Your eyes are like doves.',
        NKJV: 'Behold, you are fair, my love! Behold, you are fair! You have dove\'s eyes.',
      },
      activities: [
        { id: 's1004-5', duration_minutes: 5, title: 'Reflect', description: 'Do you still notice your spouse\'s beauty, both outwardly and inwardly? When was the last time you paused to really see them?', category: 'self-reflection' },
        { id: 's1004-5b', duration_minutes: 5, title: 'Put words to what you see', description: 'Notice something about your spouse\'s character or presence today and express it to them. Keep it honest and specific.', category: 'self-reflection' },
        { id: 's1004-10', duration_minutes: 10, title: 'Give a genuine compliment out loud', description: 'Say one clear compliment about how your spouse looks and add something like, "I realised I don\'t say this enough."', category: 'action-for-partner' },
        { id: 's1004-20', duration_minutes: 20, title: 'Try a "catch-up chat"', description: 'Each take turns sharing something about your day while the other just listens without trying to fix things.', category: 'action-with-partner' },
        { id: 's1004-60', duration_minutes: 60, title: 'See and say beauty', description: 'Say, "I don\'t say this enough, but I find you really attractive." Sit facing each other and hold eye contact while talking, then move closer and let the moment build into touch.', category: 'action-with-partner' },
      ]
    },
    // Day 5: Love
    {
      day_number: 5,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 2:3',
      bible_text: {
        NIV: 'Like an apple tree among the trees of the forest is my beloved among the young men. I delight to sit in his shade, and his fruit is sweet to my taste.',
        ESV: 'As an apple tree among the trees of the forest, so is my beloved among the young men. With great delight I sat in his shadow, and his fruit was sweet to my taste.',
        KJV: 'As the apple tree among the trees of the wood, so is my beloved among the sons. I sat down under his shadow with great delight, and his fruit was sweet to my taste.',
        NLT: 'Like the finest apple tree in the orchard is my lover among other young men. I sit in his delightful shade and taste his delicious fruit.',
        NKJV: 'Like an apple tree among the trees of the woods, so is my beloved among the sons. I sat down in his shade with great delight, and his fruit was sweet to my taste.',
      },
      activities: [
        { id: 's1005-5', duration_minutes: 5, title: 'Journal', description: 'Does your spouse feel like a place of delight, comfort and sweetness to you? If that has faded, what may have crowded it out?', category: 'self-reflection' },
        { id: 's1005-5b', duration_minutes: 5, title: 'Let them know you enjoy them', description: 'Notice something about being with your spouse that you genuinely enjoy and share it in a natural way today. Keep it light and sincere.', category: 'self-reflection' },
        { id: 's1005-10', duration_minutes: 10, title: 'Sit close for a minute', description: 'Go and sit next to your spouse and say something simple like, "I feel like we\'ve been a bit busy lately, I just wanted to sit with you for a minute."', category: 'action-for-partner' },
        { id: 's1005-20', duration_minutes: 20, title: 'Share something you admire', description: 'Take turns sharing one quality you admire in each other. Keep it genuine and simple.', category: 'action-with-partner' },
        { id: 's1005-60', duration_minutes: 60, title: 'Create a delight night', description: 'Say, "I miss properly enjoying time with you." Go out for coffee or dessert and stay longer. At home, stay in one space, share one thing you enjoyed about each other and keep the connection going.', category: 'action-with-partner' },
      ]
    },
    // Day 6: Kindness
    {
      day_number: 6,
      fruit_theme: 'Kindness',
      tone: 'Gentle',
      bible_reference: 'Colossians 3:12',
      bible_text: {
        NIV: 'Therefore, as God\'s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.',
        ESV: 'Put on then, as God\'s chosen ones, holy and beloved, compassionate hearts, kindness, humility, meekness, and patience,',
        KJV: 'Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering;',
        NLT: 'Since God chose you to be the holy people he loves, you must clothe yourselves with tenderhearted mercy, kindness, humility, gentleness, and patience.',
        NKJV: 'Therefore, as the elect of God, holy and beloved, put on tender mercies, kindness, humility, meekness, longsuffering;',
      },
      activities: [
        { id: 's1006-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would reveal anything in your heart that has hardened or closed off. Pray that your spouse would feel safe, cherished and at peace with you. Pray that your marriage would become a place of comfort, delight and emotional rest.', category: 'self-reflection' },
        { id: 's1006-5b', duration_minutes: 5, title: 'Take a moment to reset your posture', description: 'Take a few minutes to reflect on your attitude toward your spouse today and ask God to help you respond with more patience, kindness and humility.', category: 'self-reflection' },
        { id: 's1006-10', duration_minutes: 10, title: 'Do one kind thing quietly', description: 'Do one small helpful task for your spouse without pointing it out.', category: 'action-for-partner' },
        { id: 's1006-20', duration_minutes: 20, title: 'Talk about what\'s been going well', description: 'Spend a few minutes sharing what has felt good in your relationship lately. Keep the focus positive.', category: 'action-with-partner' },
        { id: 's1006-60', duration_minutes: 60, title: 'Kindness in action night', description: 'Plan a simple evening where you actively do small kind things for your spouse. Cook, tidy or help, then sit together and tell them what you appreciate about them. Keep your tone gentle and honouring throughout.', category: 'action-with-partner' },
      ]
    },
    // Day 7: Love
    {
      day_number: 7,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 2:10',
      bible_text: {
        NIV: 'My beloved spoke and said to me, "Arise, my darling, my beautiful one, come with me."',
        ESV: 'My beloved speaks and says to me: "Arise, my love, my beautiful one, and come away,"',
        KJV: 'My beloved spake, and said unto me, Rise up, my love, my fair one, and come away.',
        NLT: 'My lover said to me, "Rise up, my darling! Come away with me, my fair one!"',
        NKJV: 'My beloved spoke, and said to me: "Rise up, my love, my fair one, and come away.',
      },
      activities: [
        { id: 's1007-5', duration_minutes: 5, title: 'Reflect', description: 'When was the last time you invited your spouse into a moment of connection, fun or closeness? Are you still creating space for the two of you to step away from routine together?', category: 'self-reflection' },
        { id: 's1007-5b', duration_minutes: 5, title: 'Invite them into a moment', description: 'At some point today, invite your spouse to step into a small moment with you, whether it\'s sitting together, stepping outside or taking a short break. Keep it simple.', category: 'self-reflection' },
        { id: 's1007-10', duration_minutes: 10, title: 'Invite them to join you', description: 'Ask your spouse to come do something simple with you, like sitting outside or watching something.', category: 'action-for-partner' },
        { id: 's1007-20', duration_minutes: 20, title: 'Ask one easy question', description: 'Ask: "What\'s something you\'ve enjoyed this week?" and let the conversation flow naturally from there.', category: 'action-with-partner' },
        { id: 's1007-60', duration_minutes: 60, title: 'Come away together', description: 'Say, "come with me," and take a short drive, walk or coffee outing. Stay present and unhurried, then return home and continue the night sitting close and connected.', category: 'action-with-partner' },
      ]
    },
    // Day 8: Love
    {
      day_number: 8,
      fruit_theme: 'Love',
      tone: 'Encouraging',
      bible_reference: '1 Corinthians 13:4',
      bible_text: {
        NIV: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
        ESV: 'Love is patient and kind; love does not envy or boast; it is not arrogant.',
        KJV: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.',
        NLT: 'Love is patient and kind. Love is not jealous or boastful or proud.',
        NKJV: 'Love suffers long and is kind; love does not envy; love does not parade itself, is not puffed up.',
      },
      activities: [
        { id: 's1008-5', duration_minutes: 5, title: 'Journal', description: 'What does love mean to you in practice? What are all the ways you feel love, and show love, for your spouse?', category: 'self-reflection' },
        { id: 's1008-5b', duration_minutes: 5, title: 'Put your version of love into words', description: 'Take a moment today to express to your spouse what love looks like to you in action, either in a message or in person. For example, "I love it when…"', category: 'self-reflection' },
        { id: 's1008-10', duration_minutes: 10, title: 'Finish something together', description: 'Say, "let\'s quickly do this together," and complete one small task side by side.', category: 'action-for-partner' },
        { id: 's1008-20', duration_minutes: 20, title: 'Share a small win', description: 'Take turns sharing one small win from your day or week. Keep it light and encouraging.', category: 'action-with-partner' },
        { id: 's1008-60', duration_minutes: 60, title: 'Play a cheeky game together', description: 'Find a YouTube music quiz, movie trivia, or lyric challenge and add a twist: one item of clothing off for every wrong answer. Keep it fun, keep it fair, and see where the night takes you!', category: 'action-with-partner' },
      ]
    },
    // Day 9: Love
    {
      day_number: 9,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 2:16',
      bible_text: {
        NIV: 'My beloved is mine and I am his; he browses among the lilies.',
        ESV: 'My beloved is mine, and I am his; he grazes among the lilies.',
        KJV: 'My beloved is mine, and I am his: he feedeth among the lilies.',
        NLT: 'My lover is mine, and I am his. He browses among the lilies.',
        NKJV: 'My beloved is mine, and I am his. He feeds his flock among the lilies.',
      },
      activities: [
        { id: 's1009-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would deepen your understanding of love in action. Pray that your spouse would feel chosen, secure and deeply valued. Pray that your marriage would be strengthened through consistent love and intentional connection.', category: 'self-reflection' },
        { id: 's1009-5b', duration_minutes: 5, title: 'Reinforce that you choose them', description: 'Let your spouse know in a simple way today that you choose them and value being together. Keep it natural and not over-explained.', category: 'self-reflection' },
        { id: 's1009-10', duration_minutes: 10, title: 'Do something they like without asking', description: 'Put on something they enjoy or set up something you know they like without checking first.', category: 'action-for-partner' },
        { id: 's1009-20', duration_minutes: 20, title: 'Reflect on a recent good moment', description: 'Take a moment to talk about a recent time that felt good between you. Keep it simple and positive.', category: 'action-with-partner' },
        { id: 's1009-60', duration_minutes: 60, title: 'Reinforce belonging together', description: 'Share a meal, then sit side by side and stay physically close. Talk, relax or watch something, but keep touch present to reinforce connection.', category: 'action-with-partner' },
      ]
    },
    // Day 10: Love
    {
      day_number: 10,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 3:4',
      bible_text: {
        NIV: 'Scarcely had I passed them when I found the one my heart loves. I held him and would not let him go.',
        ESV: 'Scarcely had I passed them when I found him whom my soul loves. I held him, and would not let him go.',
        KJV: 'It was but a little that I passed from them, but I found him whom my soul loveth: I held him, and would not let him go.',
        NLT: 'Soon I found the one I love. I caught and held him tightly, then I brought him to my mother\'s house.',
        NKJV: 'Scarcely had I passed by them, when I found the one I love. I held him and would not let him go.',
      },
      activities: [
        { id: 's1010-5', duration_minutes: 5, title: 'Reflect', description: 'Do you reach for your spouse and hold onto connection when you have the chance, or do you let those moments pass? What helps you stay emotionally and physically close?', category: 'self-reflection' },
        { id: 's1010-5b', duration_minutes: 5, title: 'Reach for connection today', description: 'Make a conscious choice today to reach for your spouse, whether through a message, touch or shared moment, instead of letting the opportunity pass.', category: 'self-reflection' },
        { id: 's1010-10', duration_minutes: 10, title: 'Send a mid-day message', description: 'Send your spouse a message today that says something like, "Just thinking about you. I don\'t tell you enough... I love that you\'re mine. x" No need for a response. Just let them feel reached for.', category: 'action-for-partner' },
        { id: 's1010-20', duration_minutes: 20, title: 'Create a short "us moment"', description: 'Set aside 20 minutes just to sit together and check in lightly on your day.', category: 'action-with-partner' },
        { id: 's1010-60', duration_minutes: 60, title: 'Hold onto each other', description: 'Create a night where you don\'t drift apart. Sit, talk or lie together and stay physically connected for longer than usual, letting closeness build naturally.', category: 'action-with-partner' },
      ]
    },
    // Day 11: Gentleness
    {
      day_number: 11,
      fruit_theme: 'Gentleness',
      tone: 'Encouraging',
      bible_reference: 'Song of Solomon 4:1',
      bible_text: {
        NIV: 'How beautiful you are, my darling! Oh, how beautiful! Your eyes behind your veil are doves.',
        ESV: 'Behold, you are beautiful, my love, behold, you are beautiful! Your eyes are doves behind your veil.',
        KJV: 'Behold, thou art fair, my love; behold, thou art fair; thou hast doves\' eyes within thy locks.',
        NLT: 'You are beautiful, my darling, beautiful beyond words. Your eyes are like doves behind your veil.',
        NKJV: 'Behold, you are fair, my love! Behold, you are fair! You have dove\'s eyes behind your veil.',
      },
      activities: [
        { id: 's1011-5', duration_minutes: 5, title: 'Journal', description: 'When was the last time you truly noticed your spouse and told them what you see in them? If not, what\'s holding you back?', category: 'self-reflection' },
        { id: 's1011-5b', duration_minutes: 5, title: 'Call out something specific you notice', description: 'Notice one specific detail about your spouse today and point it out to them in a natural way. Make it something personal rather than generic.', category: 'self-reflection' },
        { id: 's1011-10', duration_minutes: 10, title: 'Say something appreciative in the moment', description: 'When you notice something positive about your spouse, or something they have done, tell them not only "thank you" but also why you\'re thankful and how it makes you feel.', category: 'action-for-partner' },
        { id: 's1011-20', duration_minutes: 20, title: 'Share something you\'re grateful for', description: 'Take turns sharing one or things you\'re grateful for about each other today. If you\'re not comfortable giving or receiving compliments, try to be generous in giving, and to also accept what you receive.', category: 'action-with-partner' },
        { id: 's1011-60', duration_minutes: 60, title: 'Give focused touch time', description: 'Sit together and take turns giving a slow back scratch or shoulder rub for at least 10 minutes each. Stay close afterward, talking or relaxing, letting physical closeness rebuild naturally.', category: 'action-with-partner' },
      ]
    },
    // Day 12: Goodness
    {
      day_number: 12,
      fruit_theme: 'Goodness',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 4:7',
      bible_text: {
        NIV: 'You are altogether beautiful, my darling; there is no flaw in you.',
        ESV: 'You are altogether beautiful, my love; there is no flaw in you.',
        KJV: 'Thou art all fair, my love; there is no spot in thee.',
        NLT: 'You are altogether beautiful, my darling, beautiful in every way.',
        NKJV: 'You are all fair, my love, and there is no spot in you.',
      },
      activities: [
        { id: 's1012-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would help you see your spouse through a lens of love and admiration. Pray that your spouse would feel seen, appreciated and affirmed. Pray that your marriage would be filled with encouragement and emotional closeness.', category: 'self-reflection' },
        { id: 's1012-5b', duration_minutes: 5, title: 'Shift what you focus on', description: 'Make a conscious effort today to focus on your spouse\'s strengths rather than their flaws, and express one of those strengths to them.', category: 'self-reflection' },
        { id: 's1012-10', duration_minutes: 10, title: 'Do one small loving action', description: 'Do something thoughtful that will also be good for your spouse. You could make them a drink they like or help them with something they have been meaning to do.', category: 'action-for-partner' },
        { id: 's1012-20', duration_minutes: 20, title: 'Notice something out loud', description: 'Say something you\'ve noticed about your spouse that they do really well, and praise them for it. Include why it\'s such a good quality.', category: 'action-with-partner' },
        { id: 's1012-60', duration_minutes: 60, title: 'Notice and touch gently', description: 'Sit facing each other and name one good thing you notice about your spouse\'s face or expression. Then move beside them and stay physically close, adding gentle touch throughout the evening.', category: 'action-with-partner' },
      ]
    },
    // Day 13: Love
    {
      day_number: 13,
      fruit_theme: 'Love',
      tone: 'Light Stretch',
      bible_reference: '1 John 3:18',
      bible_text: {
        NIV: 'Dear children, let us not love with words or speech but with actions and in truth.',
        ESV: 'Little children, let us not love in word or talk but in deed and in truth.',
        KJV: 'My little children, let us not love in word, neither in tongue; but in deed and in truth.',
        NLT: 'Dear children, let\'s not merely say that we love each other; let us show the truth by our actions.',
        NKJV: 'My little children, let us not love in word or in tongue, but in deed and in truth.',
      },
      activities: [
        { id: 's1013-5', duration_minutes: 5, title: 'Reflect', description: 'Are there ways you say "I love you" out of habit, but don\'t always back it up with action? What could that look like today?', category: 'self-reflection' },
        { id: 's1013-5b', duration_minutes: 5, title: 'Back up your words with action', description: 'Think about something you often say but don\'t always show, and take one step today to act on it. Keep it simple and real.', category: 'self-reflection' },
        { id: 's1013-10', duration_minutes: 10, title: 'Mention something you noticed', description: 'Say something like "I really feel loved when you - insert the thing - , thank you so much." Feel free to add a kiss and a cuddle.', category: 'action-for-partner' },
        { id: 's1013-20', duration_minutes: 20, title: 'Share what you\'ve been enjoying', description: 'Take turns sharing something you\'ve been enjoying recently, whether big or small. Keep it light and open.', category: 'action-with-partner' },
        { id: 's1013-60', duration_minutes: 60, title: 'Let actions show love', description: 'Do one practical thing for your spouse that makes their night easier. Then sit together and follow it with something physical like a head rub or holding each other.', category: 'action-with-partner' },
      ]
    },
    // Day 14: Love
    {
      day_number: 14,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 4:9',
      bible_text: {
        NIV: 'You have stolen my heart, my sister, my bride; you have stolen my heart with one glance of your eyes.',
        ESV: 'You have captivated my heart, my sister, my bride; you have captivated my heart with one glance of your eyes.',
        KJV: 'Thou hast ravished my heart, my sister, my spouse; thou hast ravished my heart with one of thine eyes.',
        NLT: 'You have captured my heart, my treasure, my bride. You hold it hostage with one glance of your eyes.',
        NKJV: 'You have ravished my heart, my sister, my spouse; you have ravished my heart with one look of your eyes.',
      },
      activities: [
        { id: 's1014-5', duration_minutes: 5, title: 'Journal', description: 'When was the last time you felt drawn to your spouse in a strong, emotional or physical way? What sparked that feeling?', category: 'self-reflection' },
        { id: 's1014-5b', duration_minutes: 5, title: 'Let attraction show', description: 'Notice a moment today where you feel drawn to your spouse and allow that to show through your words or tone. Don\'t overthink it.', category: 'self-reflection' },
        { id: 's1014-10', duration_minutes: 10, title: 'Send an encouraging message', description: 'Send a message saying something like "you\'ve got this today" or "thinking of you."', category: 'action-for-partner' },
        { id: 's1014-20', duration_minutes: 20, title: 'Ask a future-focused question', description: 'Ask: "What\'s something you\'re looking forward to?" and let the conversation grow naturally.', category: 'action-with-partner' },
        { id: 's1014-60', duration_minutes: 60, title: 'Hold and don\'t rush', description: 'Sit or lie together and stay physically close for at least 10 minutes without distraction. Let your bodies relax before doing anything else together.', category: 'action-with-partner' },
      ]
    },
    // Day 15: Love
    {
      day_number: 15,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 4:10',
      bible_text: {
        NIV: 'How delightful is your love, my sister, my bride! How much more pleasing is your love than wine.',
        ESV: 'How beautiful is your love, my sister, my bride! How much better is your love than wine.',
        KJV: 'How fair is thy love, my sister, my spouse! how much better is thy love than wine!',
        NLT: 'How delightful is your love, my treasure, my bride! Your love is better than wine.',
        NKJV: 'How fair is your love, my sister, my spouse! How much better than wine is your love!',
      },
      activities: [
        { id: 's1015-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would renew your desire and enjoyment of your spouse. Pray that your spouse would feel wanted and valued by you. Pray that your marriage would be marked by joy, attraction and intentional time together.', category: 'self-reflection' },
        { id: 's1015-5b', duration_minutes: 5, title: 'Express enjoyment in the moment', description: 'When you notice yourself enjoying your spouse today, say it out loud rather than keeping it to yourself. Keep it simple and natural.', category: 'self-reflection' },
        { id: 's1015-10', duration_minutes: 10, title: 'Make their day easier', description: 'Ask, "what\'s one thing I can take off you right now?" and do it.', category: 'action-for-partner' },
        { id: 's1015-20', duration_minutes: 20, title: 'Check in on energy', description: 'Ask: "How are you feeling today?" and listen with interest, without trying to change anything.', category: 'action-with-partner' },
        { id: 's1015-60', duration_minutes: 60, title: 'Slow enjoyment together', description: 'Share a drink, music or a simple treat. Sit close, touch often and move slowly through the evening, letting connection build through presence and physical closeness.', category: 'action-with-partner' },
      ]
    },
    // Day 16: Goodness
    {
      day_number: 16,
      fruit_theme: 'Goodness',
      tone: 'Gentle',
      bible_reference: 'Galatians 6:2',
      bible_text: {
        NIV: 'Carry each other\'s burdens, and in this way you will fulfill the law of Christ.',
        ESV: 'Bear one another\'s burdens, and so fulfill the law of Christ.',
        KJV: 'Bear ye one another\'s burdens, and so fulfil the law of Christ.',
        NLT: 'Share each other\'s burdens, and in this way obey the law of Christ.',
        NKJV: 'Bear one another\'s burdens, and so fulfill the law of Christ.',
      },
      activities: [
        { id: 's1016-5', duration_minutes: 5, title: 'Reflect', description: 'Is your spouse carrying something right now that you could step into and support them with? What might that look like in a simple, practical way?', category: 'self-reflection' },
        { id: 's1016-5b', duration_minutes: 5, title: 'Ask what they need most', description: 'At a natural moment today, ask your spouse what would help them most right now, and listen without interrupting or jumping in with solutions.', category: 'self-reflection' },
        { id: 's1016-10', duration_minutes: 10, title: 'Say "let\'s do this together"', description: 'Pick something small that needs to be done, then do it side by side.', category: 'action-for-partner' },
        { id: 's1016-20', duration_minutes: 20, title: 'Share how you\'ve worked well together', description: 'Talk about something that has worked well between you recently, and ask your spouse if they\'d like to share the same.', category: 'action-with-partner' },
        { id: 's1016-60', duration_minutes: 60, title: 'Carry each other gently', description: 'Start the night by asking, "What would help you unwind right now?" Then take turns doing whatever that is, making sure you are both comfortable with it.', category: 'action-with-partner' },
      ]
    },
    // Day 17: Patience
    {
      day_number: 17,
      fruit_theme: 'Patience',
      tone: 'Light Stretch',
      bible_reference: 'Ephesians 4:2',
      bible_text: {
        NIV: 'Be completely humble and gentle; be patient, bearing with one another in love.',
        ESV: 'with all humility and gentleness, with patience, bearing with one another in love,',
        KJV: 'With all lowliness and meekness, with longsuffering, forbearing one another in love;',
        NLT: 'Always be humble and gentle. Be patient with each other, making allowance for each other\'s faults because of your love.',
        NKJV: 'with all lowliness and gentleness, with longsuffering, bearing with one another in love,',
      },
      activities: [
        { id: 's1017-5', duration_minutes: 5, title: 'Journal', description: 'What are things that annoy or frustrate you about your spouse, and how could you change the way you think about it so that you are bearing with them in love?', category: 'self-reflection' },
        { id: 's1017-5b', duration_minutes: 5, title: 'Apologise', description: 'Say sorry to your spouse about something you get annoyed with them about, which is something inconsequential (eg. eating loudly). Don\'t add "but…" onto the end.', category: 'self-reflection' },
        { id: 's1017-10', duration_minutes: 10, title: 'Choose something of service', description: 'Think of something you can do that shows gentleness and patience. Not just a task around the house.', category: 'action-for-partner' },
        { id: 's1017-20', duration_minutes: 20, title: 'Ask for feedback', description: 'Ask your spouse to tell you one situation in which you could be more gentle and patient with them.', category: 'action-with-partner' },
        { id: 's1017-60', duration_minutes: 60, title: 'Spend a gentle evening', description: 'Set up the lounge room with a foot washing station, and invite your spouse to sit and enjoy a gentle foot wash and massage.', category: 'action-with-partner' },
      ]
    },
    // Day 18: Faithfulness
    {
      day_number: 18,
      fruit_theme: 'Faithfulness',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 5:16',
      bible_text: {
        NIV: 'His mouth is sweetness itself; he is altogether lovely. This is my beloved, this is my friend.',
        ESV: 'His mouth is most sweet, and he is altogether desirable. This is my beloved and this is my friend.',
        KJV: 'His mouth is most sweet: yea, he is altogether lovely. This is my beloved, and this is my friend.',
        NLT: 'His mouth is sweetness itself; he is desirable in every way. Such, O women of Jerusalem, is my lover, my friend.',
        NKJV: 'His mouth is most sweet, yes, he is altogether lovely. This is my beloved, and this is my friend.',
      },
      activities: [
        { id: 's1018-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would make you more aware of your spouse\'s needs. Pray that your spouse would feel supported, strengthened and cared for. Pray that your marriage would grow in teamwork and mutual support.', category: 'self-reflection' },
        { id: 's1018-5b', duration_minutes: 5, title: 'Acknowledge the friendship side', description: 'Let your spouse know something you appreciate about them as a friend, not just as a partner.', category: 'self-reflection' },
        { id: 's1018-10', duration_minutes: 10, title: 'Be supportive', description: 'Find something you can support and encourage your spouse with, the way you would your best friend.', category: 'action-for-partner' },
        { id: 's1018-20', duration_minutes: 20, title: 'Reflect on what\'s been steady', description: 'Take a moment to share what has felt steady or dependable in your relationship.', category: 'action-with-partner' },
        { id: 's1018-60', duration_minutes: 60, title: 'Speak and show desire', description: 'Say one thing you genuinely desire about your spouse. Sit close and run your hands slowly over their arms, shoulders or back while talking, letting touch become natural and unhurried.', category: 'action-with-partner' },
      ]
    },
    // Day 19: Goodness
    {
      day_number: 19,
      fruit_theme: 'Goodness',
      tone: 'Encouraging',
      bible_reference: 'Romans 15:2',
      bible_text: {
        NIV: 'Each of us should please our neighbors for their good, to build them up.',
        ESV: 'Let each of us please his neighbor for his good, to build him up.',
        KJV: 'Let every one of us please his neighbour for his good to edification.',
        NLT: 'We should help others do what is right and build them up.',
        NKJV: 'Let each of us please his neighbor for his good, leading to edification.',
      },
      activities: [
        { id: 's1019-5', duration_minutes: 5, title: 'Reflect', description: 'Do you still see your spouse as both your partner and your friend? How do you nurture both parts of that relationship?', category: 'self-reflection' },
        { id: 's1019-5b', duration_minutes: 5, title: 'Say something that lifts them up', description: 'Notice something about your spouse today and say something that genuinely builds them up. Keep it specific and real.', category: 'self-reflection' },
        { id: 's1019-10', duration_minutes: 10, title: 'Do one thoughtful thing in their space', description: 'Tidy, set up, or prepare something in a space they use often.', category: 'action-for-partner' },
        { id: 's1019-20', duration_minutes: 20, title: 'Share one thoughtful observation', description: 'Take turns sharing something thoughtful you\'ve noticed about each other.', category: 'action-with-partner' },
        { id: 's1019-60', duration_minutes: 60, title: 'Build each other up', description: 'Spend the evening sharing specific things you appreciate, respect or admire about each other. Sit together and say them out loud, one at a time, letting your spouse fully receive each one before relaxing together.', category: 'action-with-partner' },
      ]
    },
    // Day 20: Love
    {
      day_number: 20,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 6:3',
      bible_text: {
        NIV: 'I am my beloved\'s and my beloved is mine; he browses among the lilies.',
        ESV: 'I am my beloved\'s and my beloved is mine; he grazes among the lilies.',
        KJV: 'I am my beloved\'s, and my beloved is mine: he feedeth among the lilies.',
        NLT: 'I am my lover\'s, and he claims me as his own. He feeds among the lilies.',
        NKJV: 'I am my beloved\'s, and my beloved is mine. He feeds his flock among the lilies.',
      },
      activities: [
        { id: 's1020-5', duration_minutes: 5, title: 'Journal', description: 'When did you last intentionally build your spouse up with your words or actions? What impact did that have?', category: 'self-reflection' },
        { id: 's1020-5b', duration_minutes: 5, title: 'Reinforce your connection in words', description: 'Let your spouse know something you value about being together as a couple and what "us" means to you right now.', category: 'self-reflection' },
        { id: 's1020-10', duration_minutes: 10, title: 'Sit with them while they\'re doing something', description: 'Join them where they already are and just be there with them.', category: 'action-for-partner' },
        { id: 's1020-20', duration_minutes: 20, title: 'Create a short "us" reset', description: 'Take 10–15 minutes to reconnect briefly on your day and your energy.', category: 'action-with-partner' },
        { id: 's1020-60', duration_minutes: 60, title: 'Stay close and responsive', description: 'Sit or lie together and stay touching for at least 15 minutes. Focus on slow, intentional touch like hands, arms, shoulders or back, noticing what your spouse responds to and following that.', category: 'action-with-partner' },
      ]
    },
    // Day 21: Love
    {
      day_number: 21,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 7:6',
      bible_text: {
        NIV: 'How beautiful you are and how pleasing, my love, with your delights!',
        ESV: 'How beautiful and pleasant you are, O loved one, with all your delights!',
        KJV: 'How fair and how pleasant art thou, O love, for delights!',
        NLT: 'Oh, how beautiful you are! How pleasing, my love, how full of delights!',
        NKJV: 'How fair and how pleasant you are, O love, with your delights!',
      },
      activities: [
        { id: 's1021-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would strengthen your unity as a couple. Pray that your spouse would feel encouraged and uplifted by you. Pray that your marriage would grow in friendship, support and shared purpose.', category: 'self-reflection' },
        { id: 's1021-5b', duration_minutes: 5, title: 'Let your attraction show', description: 'Notice something about your spouse today that you find attractive or pleasing and express it in a natural, genuine way.', category: 'self-reflection' },
        { id: 's1021-10', duration_minutes: 10, title: 'Start a small moment of touch', description: 'Put your hand on theirs, give a quick hug or sit closer than usual.', category: 'action-for-partner' },
        { id: 's1021-20', duration_minutes: 20, title: 'Share what you enjoy about being together', description: 'Take turns sharing what you enjoy most about spending time together. Keep it light and genuine.', category: 'action-with-partner' },
        { id: 's1021-60', duration_minutes: 60, title: 'Let the night be easy and close', description: 'Put music on, pour a drink and spend the evening without a plan. Sit close, talk when something comes up and let the night be unhurried. Just the two of you, comfortable and connected.', category: 'action-with-partner' },
      ]
    },
    // Day 22: Self-control
    {
      day_number: 22,
      fruit_theme: 'Self-control',
      tone: 'Gentle',
      bible_reference: 'Proverbs 19:11',
      bible_text: {
        NIV: 'A person\'s wisdom yields patience; it is to one\'s glory to overlook an offense.',
        ESV: 'Good sense makes one slow to anger, and it is his glory to overlook an offense.',
        KJV: 'The discretion of a man deferreth his anger; and it is his glory to pass over a transgression.',
        NLT: 'Sensible people control their temper; they earn respect by overlooking wrongs.',
        NKJV: 'The discretion of a man makes him slow to anger, and his glory is to overlook a transgression.',
      },
      activities: [
        { id: 's1022-5', duration_minutes: 5, title: 'Reflect', description: 'Where do you tend to react quickly or take offence before you\'ve thought it through? What would one steadier, wiser response look like today?', category: 'self-reflection' },
        { id: 's1022-5b', duration_minutes: 5, title: 'Choose to let something go', description: 'Notice a moment today where you could take offense and consciously choose to let it pass without reacting.', category: 'self-reflection' },
        { id: 's1022-10', duration_minutes: 10, title: 'Make them smile on purpose', description: 'Say or do something playful, cheeky or light to get a smile.', category: 'action-for-partner' },
        { id: 's1022-20', duration_minutes: 20, title: 'Share something playful', description: 'Take a few minutes to be playful together, whether that\'s joking, reminiscing or light conversation.', category: 'action-with-partner' },
        { id: 's1022-60', duration_minutes: 60, title: 'Practice patience together', description: 'Choose a calm setting like a walk or tea. Speak slowly, don\'t interrupt and give each other space to finish thoughts. Notice how patience in tone and response changes the feeling between you.', category: 'action-with-partner' },
      ]
    },
    // Day 23: Love
    {
      day_number: 23,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 7:10',
      bible_text: {
        NIV: 'I belong to my beloved, and his desire is for me.',
        ESV: 'I am my beloved\'s, and his desire is for me.',
        KJV: 'I am my beloved\'s, and his desire is toward me.',
        NLT: 'I am my lover\'s, and he claims me as his own.',
        NKJV: 'I am my beloved\'s, and his desire is toward me.',
      },
      activities: [
        { id: 's1023-5', duration_minutes: 5, title: 'Journal', description: 'Are there moments where you hold onto frustration or take offense more quickly than you need to? What would it look like to let that go more often?', category: 'self-reflection' },
        { id: 's1023-5b', duration_minutes: 5, title: 'Express desire directly', description: 'Tell your spouse in a simple and natural way that you desire them or enjoy being close to them. Keep it real rather than overthought.', category: 'self-reflection' },
        { id: 's1023-10', duration_minutes: 10, title: 'Pause and give them your full attention', description: 'Stop what you\'re doing and give them your full attention for a minute when they speak.', category: 'action-for-partner' },
        { id: 's1023-20', duration_minutes: 20, title: 'Talk about what helps you feel close', description: 'Take turns sharing what helps you feel connected in everyday life. Keep it simple and positive.', category: 'action-with-partner' },
        { id: 's1023-60', duration_minutes: 60, title: 'Share desire and openness', description: 'Sit facing each other and share one thing you desire more of in your relationship, emotionally or physically. Listen without reacting, then stay close and let that openness create deeper connection.', category: 'action-with-partner' },
      ]
    },
    // Day 24: Self-control
    {
      day_number: 24,
      fruit_theme: 'Self-control',
      tone: 'Gentle',
      bible_reference: 'Psalm 37:8',
      bible_text: {
        NIV: 'Refrain from anger and turn from wrath; do not fret...it leads only to evil.',
        ESV: 'Refrain from anger, and forsake wrath! Fret not yourself; it tends only to evil.',
        KJV: 'Cease from anger, and forsake wrath: fret not thyself in any wise to do evil.',
        NLT: 'Stop being angry! Turn from your rage! Do not lose your temper...it only leads to harm.',
        NKJV: 'Cease from anger, and forsake wrath; do not fret...it only causes harm.',
      },
      activities: [
        { id: 's1024-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would give you patience and self-control in your responses. Pray that your spouse would feel safe and respected, even in difficult moments. Pray that your marriage would be marked by grace, understanding and peace.', category: 'self-reflection' },
        { id: 's1024-5b', duration_minutes: 5, title: 'Pause before reacting', description: 'When you feel frustration rise today, take a breath and choose your response rather than reacting immediately.', category: 'self-reflection' },
        { id: 's1024-10', duration_minutes: 10, title: 'Suggest doing something different', description: 'Say, "let\'s do something different for a bit," and change the activity or setting.', category: 'action-for-partner' },
        { id: 's1024-20', duration_minutes: 20, title: 'Share something new about yourself', description: 'Take a few minutes to share something your spouse may not know or hasn\'t heard in a while.', category: 'action-with-partner' },
        { id: 's1024-60', duration_minutes: 60, title: 'Release tension gently', description: 'Start with a quiet walk or sit together calmly. Talk through anything lingering with a gentle tone, then shift into something soothing like music or sitting close to reset the mood.', category: 'action-with-partner' },
      ]
    },
    // Day 25: Joy
    {
      day_number: 25,
      fruit_theme: 'Joy',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 7:12',
      bible_text: {
        NIV: 'Let us go early to the vineyards to see if the vines have budded.',
        ESV: 'let us go out early to the vineyards and see whether the vines have budded.',
        KJV: 'Let us get up early to the vineyards; let us see if the vine flourish.',
        NLT: 'Let us get up early and go to the vineyards to see if the grapevines have budded.',
        NKJV: 'Let us get up early to the vineyards; let us see if the vine has budded.',
      },
      activities: [
        { id: 's1025-5', duration_minutes: 5, title: 'Reflect', description: 'Do you feel desired by your spouse, and do they feel desired by you? If that has faded, what part have you played in that shift?', category: 'self-reflection' },
        { id: 's1025-5b', duration_minutes: 5, title: 'Express enjoyment of your time together', description: 'Take a moment today to tell your spouse something you genuinely enjoy about the time you spend together. Keep it simple and in-the-moment.', category: 'self-reflection' },
        { id: 's1025-10', duration_minutes: 10, title: 'Use "we" language once', description: 'Say something like "we\'ll figure it out" or "we\'ve got this."', category: 'action-for-partner' },
        { id: 's1025-20', duration_minutes: 20, title: 'Share what being a team means', description: 'Take a few minutes to talk about what teamwork looks like for you. Keep it practical and grounded.', category: 'action-with-partner' },
        { id: 's1025-60', duration_minutes: 60, title: 'Create a shared experience together', description: 'Go somewhere simple like a lookout, walk or café. Stay longer than usual, then return home and continue the night sitting or lying close, letting the connection carry through both settings.', category: 'action-with-partner' },
      ]
    },
    // Day 26: Love
    {
      day_number: 26,
      fruit_theme: 'Love',
      tone: 'Encouraging',
      bible_reference: '1 Peter 4:8',
      bible_text: {
        NIV: 'Above all, love each other deeply, because love covers over a multitude of sins.',
        ESV: 'Above all, keep loving one another earnestly, since love covers a multitude of sins.',
        KJV: 'And above all things have fervent charity among yourselves: for charity shall cover the multitude of sins.',
        NLT: 'Most important of all, continue to show deep love for each other, for love covers a multitude of sins.',
        NKJV: 'And above all things have fervent love for one another, for love will cover a multitude of sins.',
      },
      activities: [
        { id: 's1026-5', duration_minutes: 5, title: 'Journal', description: 'When you feel frustration rise toward your spouse, how do you usually respond? What would it look like to pause and choose a different response in that moment?', category: 'self-reflection' },
        { id: 's1026-5b', duration_minutes: 5, title: 'Choose your words carefully today', description: 'Be intentional about how you speak about your spouse today, both to them and about them. Choose words that reflect respect and love.', category: 'self-reflection' },
        { id: 's1026-10', duration_minutes: 10, title: 'Be extra warm in your tone', description: 'Speak more gently and warmly than usual in your next few interactions.', category: 'action-for-partner' },
        { id: 's1026-20', duration_minutes: 20, title: 'Create a moment of intentional presence', description: 'Take time to sit together and be fully present, noticing how it feels.', category: 'action-with-partner' },
        { id: 's1026-60', duration_minutes: 60, title: 'Love deeply and stay close', description: 'Start the night sitting or lying close. Take turns giving slow, attentive touch across the back, shoulders or arms. Stay present and unhurried, letting affection deepen into stronger physical connection if it feels right.', category: 'action-with-partner' },
      ]
    },
    // Day 27: Love
    {
      day_number: 27,
      fruit_theme: 'Love',
      tone: 'Passionate',
      bible_reference: 'Song of Solomon 8:6',
      bible_text: {
        NIV: 'Place me like a seal over your heart, like a seal on your arm; for love is as strong as death.',
        ESV: 'Set me as a seal upon your heart, as a seal upon your arm, for love is strong as death.',
        KJV: 'Set me as a seal upon thine heart, as a seal upon thine arm: for love is strong as death.',
        NLT: 'Place me like a seal over your heart, like a seal on your arm. For love is as strong as death.',
        NKJV: 'Set me as a seal upon your heart, as a seal upon your arm; for love is as strong as death.',
      },
      activities: [
        { id: 's1027-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would help you respond with wisdom and calmness. Pray that your spouse would feel understood and valued, not criticised. Pray that your marriage would grow in healthy communication and emotional safety.', category: 'self-reflection' },
        { id: 's1027-5b', duration_minutes: 5, title: 'Reaffirm your commitment in words', description: 'Share something with your spouse that reflects your commitment to them, not just in general terms but in how you choose them daily.', category: 'self-reflection' },
        { id: 's1027-10', duration_minutes: 10, title: 'Do one thing that builds trust', description: 'Do exactly what you said you would do, when you said you would do it.', category: 'action-for-partner' },
        { id: 's1027-20', duration_minutes: 20, title: 'Reflect on what builds trust', description: 'Take a few minutes to share what helps you feel secure and supported.', category: 'action-with-partner' },
        { id: 's1027-60', duration_minutes: 60, title: 'Mark each other as yours', description: 'Sit close and wrap your arms around each other for a full minute without distraction. Stay in that closeness, adding gentle touch and holding, reinforcing that you choose and belong to each other.', category: 'action-with-partner' },
      ]
    },
    // Day 28: Faithfulness
    {
      day_number: 28,
      fruit_theme: 'Faithfulness',
      tone: 'Encouraging',
      bible_reference: 'Ruth 1:16',
      bible_text: {
        NIV: 'Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.',
        ESV: 'Where you go I will go, and where you lodge I will lodge. Your people shall be my people, and your God my God.',
        KJV: 'Whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God.',
        NLT: 'Where you go I will go, and where you live I will live. Your people will be my people, and your God will be my God.',
        NKJV: 'Where you go, I will go; and where you lodge, I will lodge; Your people shall be my people, and your God, my God.',
      },
      activities: [
        { id: 's1028-5', duration_minutes: 5, title: 'Reflect', description: 'Has there been a time recently where you said something negative about your spouse to somebody else? If so, what could you have said instead, to have integrity in your speech about them?', category: 'self-reflection' },
        { id: 's1028-5b', duration_minutes: 5, title: 'Put loyalty into words', description: 'Express to your spouse in a simple way that you are with them, on their side, and committed to walking life alongside them.', category: 'self-reflection' },
        { id: 's1028-10', duration_minutes: 10, title: 'Suggest something to look forward to', description: 'Say, "let\'s do ___ this week" and suggest something simple and enjoyable.', category: 'action-for-partner' },
        { id: 's1028-20', duration_minutes: 20, title: 'Talk about what you enjoy most', description: 'Take turns sharing what you enjoy most in your time together.', category: 'action-with-partner' },
        { id: 's1028-60', duration_minutes: 60, title: 'Move together, stay together', description: 'Go for a walk or short drive, staying side by side. When you return, continue the night close together, sitting or lying in contact, keeping that sense of "we" through both movement and stillness.', category: 'action-with-partner' },
      ]
    },
    // Day 29: Love
    {
      day_number: 29,
      fruit_theme: 'Love',
      tone: 'Gentle',
      bible_reference: 'Colossians 3:14',
      bible_text: {
        NIV: 'And over all these virtues put on love, which binds them all together in perfect unity.',
        ESV: 'And above all these put on love, which binds everything together in perfect harmony.',
        KJV: 'And above all these things put on charity, which is the bond of perfectness.',
        NLT: 'Above all, clothe yourselves with love, which binds us all together in perfect harmony.',
        NKJV: 'But above all these things put on love, which is the bond of perfection.',
      },
      activities: [
        { id: 's1029-5', duration_minutes: 5, title: 'Journal', description: 'How deeply committed do you feel to your spouse right now, not just in words but in your actions and focus? Where might your attention be divided?', category: 'self-reflection' },
        { id: 's1029-5b', duration_minutes: 5, title: 'Be intentional in how you show love', description: 'Choose one way today to actively "put on love" in your behaviour, whether through patience, kindness or gentleness, and express that to your spouse.', category: 'self-reflection' },
        { id: 's1029-10', duration_minutes: 10, title: 'Create a quick shared moment', description: 'Say, "come here for a second," and share a quick moment together.', category: 'action-for-partner' },
        { id: 's1029-20', duration_minutes: 20, title: 'Share how your relationship has grown', description: 'Take a moment to reflect on how things have grown or improved. Keep it positive.', category: 'action-with-partner' },
        { id: 's1029-60', duration_minutes: 60, title: 'Create unity together', description: 'Do something side by side like cooking or organising a space. When finished, sit together and acknowledge what you created as a team, reinforcing unity and shared life.', category: 'action-with-partner' },
      ]
    },
    // Day 30: Love
    {
      day_number: 30,
      fruit_theme: 'Love',
      tone: 'Encouraging',
      bible_reference: 'John 15:12',
      bible_text: {
        NIV: 'My command is this: Love each other as I have loved you.',
        ESV: 'This is my commandment, that you love one another as I have loved you.',
        KJV: 'This is my commandment, That ye love one another, as I have loved you.',
        NLT: 'This is my commandment: Love each other in the same way I have loved you.',
        NKJV: 'This is My commandment, that you love one another as I have loved you.',
      },
      activities: [
        { id: 's1030-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God would strengthen your commitment and focus toward your spouse. Pray that your spouse would feel secure and prioritised in your life. Pray that your marriage would be marked by faithfulness, loyalty and intentional love.', category: 'self-reflection' },
        { id: 's1030-5b', duration_minutes: 5, title: 'Say something that shows depth of love', description: 'Share something meaningful with your spouse that reflects the depth of your love for them. Let it go beyond surface-level words.', category: 'self-reflection' },
        { id: 's1030-10', duration_minutes: 10, title: 'Choose one clear act of love', description: 'Pick one simple action like making a drink, sitting close or helping, and do it straight away.', category: 'action-for-partner' },
        { id: 's1030-20', duration_minutes: 20, title: 'Share one thing you\'ll carry forward', description: 'Take turns sharing one thing you want to continue beyond this experience.', category: 'action-with-partner' },
        { id: 's1030-60', duration_minutes: 60, title: 'Love with intention tonight', description: 'Set aside the night fully. Sit close, talk, touch and stay present without distractions. Let connection, affection and physical closeness all be part of the same intentional space.', category: 'action-with-partner' },
      ]
    },
  ],
  repair: [
    // Day 1: Gentleness
    {
      day_number: 1,
      fruit_theme: 'Gentleness',
      tone: 'Light Stretch',
      bible_reference: 'Proverbs 15:1',
      bible_text: {
        NIV: 'A gentle answer turns away wrath, but a harsh word stirs up anger.',
        ESV: 'A soft answer turns away wrath, but a harsh word stirs up anger.',
        KJV: 'A soft answer turneth away wrath: but grievous words stir up anger.',
        NLT: 'A gentle answer deflects anger, but harsh words make tempers flare.',
        NKJV: 'A soft answer turns away wrath, but a harsh word stirs up anger.',
      },
      activities: [
        { id: 's2001-5', duration_minutes: 5, title: 'Pray', description: 'Pray for a softer heart today. Ask God to help your words land gently. Pray your spouse feels something shift, even in small ways. Ask for gentleness to come from Him, not just from effort.', category: 'self-reflection' },
        { id: 's2001-5b', duration_minutes: 5, title: 'Say one gentle sentence', description: 'Find a moment today to say: "I\'d love for things to feel calmer between us." Say it simply and leave it there.', category: 'self-reflection' },
        { id: 's2001-10', duration_minutes: 10, title: 'Lower the load', description: 'Do one small task for your spouse without being asked. Make a drink, tidy something, handle one job. No announcement needed.', category: 'action-for-partner' },
        { id: 's2001-20', duration_minutes: 20, title: 'What helps you feel heard', description: 'Ask: "What helps you feel heard when things are tense?" One answer each. If it feels charged, stop and come back later.', category: 'action-with-partner' },
        { id: 's2001-60', duration_minutes: 60, title: 'Walk somewhere easy', description: 'Go for a walk and keep the conversation light — a good memory, something you\'re looking forward to. Just be side by side.', category: 'action-with-partner' },
      ]
    },
    // Day 2: Faithfulness
    {
      day_number: 2,
      fruit_theme: 'Faithfulness',
      tone: 'Encouraging',
      bible_reference: 'Proverbs 3:3–4',
      bible_text: {
        NIV: 'Let love and faithfulness never leave you; bind them around your neck, write them on the tablet of your heart. Then you will win favor and a good name in the sight of God and man.',
        ESV: 'Let not steadfast love and faithfulness forsake you; bind them around your neck; write them on the tablet of your heart. So you will find favor and good success in the sight of God and man.',
        KJV: 'Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart: So shalt thou find favour and good understanding in the sight of God and man.',
        NLT: 'Never let loyalty and kindness leave you! Tie them around your neck as a reminder. Write them deep within your heart. Then you will find favor with both God and people, and you will earn a good reputation.',
        NKJV: 'Let not mercy and truth forsake you; bind them around your neck, write them on the tablet of your heart, and so find favor and high esteem in the sight of God and man.',
      },
      activities: [
        { id: 's2002-5', duration_minutes: 5, title: 'Journal', description: 'Love and faithfulness are things you carry, not just feel. What does carrying both look like in your marriage right now? What would it mean to let them stay?', category: 'self-reflection' },
        { id: 's2002-5b', duration_minutes: 5, title: 'Send a simple reassurance', description: 'Send your spouse a message: "I\'ve been thinking about us — I just want you to know I care about what we have." No expectation of a response needed.', category: 'self-reflection' },
        { id: 's2002-10', duration_minutes: 10, title: 'Show up consistently', description: 'Follow through on one thing you said you would do, or finish one small task without being reminded. Steadiness speaks.', category: 'action-for-partner' },
        { id: 's2002-20', duration_minutes: 20, title: 'A simple check-in', description: 'Ask: "What has your day been like?" Listen fully, no fixing or advising. Keep it easy.', category: 'action-with-partner' },
        { id: 's2002-60', duration_minutes: 60, title: 'A themed dinner night', description: 'Pick a simple theme — Italian, Mexican, a childhood favourite — and eat together. The aim is something shared that feels enjoyable.', category: 'action-with-partner' },
      ]
    },
    // Day 3: Love
    {
      day_number: 3,
      fruit_theme: 'Love',
      tone: 'Gentle',
      bible_reference: 'Romans 12:10',
      bible_text: {
        NIV: 'Be devoted to one another in love. Honor one another above yourselves.',
        ESV: 'Love one another with brotherly affection. Outdo one another in showing honor.',
        KJV: 'Be kindly affectioned one to another with brotherly love; in honour preferring one another;',
        NLT: 'Love each other with genuine affection, and take delight in honoring each other.',
        NKJV: 'Be kindly affectionate to one another with brotherly love, in honor giving preference to one another;',
      },
      activities: [
        { id: 's2003-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God softens your reactions today. Ask that your spouse feels respected by you, even in small moments. Pray for a marriage that becomes a place of safety and honour.', category: 'self-reflection' },
        { id: 's2003-5b', duration_minutes: 5, title: 'Say something honouring', description: 'Say to your spouse: "I don\'t say this enough, but I do respect you." Let it land without adding to it.', category: 'self-reflection' },
        { id: 's2003-10', duration_minutes: 10, title: 'One honouring act', description: 'Give your spouse preference in something small today — let them choose, take over a task, or help before they ask.', category: 'action-for-partner' },
        { id: 's2003-20', duration_minutes: 20, title: 'What respect looks like', description: 'Ask: "What makes you feel respected by me?" One example each. Listen without interrupting or correcting.', category: 'action-with-partner' },
        { id: 's2003-60', duration_minutes: 60, title: 'Let them choose', description: 'Invite your spouse to choose something simple for the two of you tonight and go along with it willingly.', category: 'action-with-partner' },
      ]
    },
    // Day 4: Kindness
    {
      day_number: 4,
      fruit_theme: 'Kindness',
      tone: 'Gentle',
      bible_reference: 'Proverbs 16:24',
      bible_text: {
        NIV: 'Gracious words are a honeycomb, sweet to the soul and healing to the bones.',
        ESV: 'Gracious words are like a honeycomb, sweetness to the soul and health to the body.',
        KJV: 'Pleasant words are as an honeycomb, sweet to the soul, and health to the bones.',
        NLT: 'Kind words are like honey—sweet to the soul and healthy for the body.',
        NKJV: 'Pleasant words are like a honeycomb, sweetness to the soul and health to the bones.',
      },
      activities: [
        { id: 's2004-5', duration_minutes: 5, title: 'Reflect', description: 'Your words have more power than you realise. Think about the last few days — where could kindness in your tone have changed the atmosphere between you?', category: 'self-reflection' },
        { id: 's2004-5b', duration_minutes: 5, title: 'Leave a kind note', description: 'Leave a short note or send a message: "I really appreciate you, even when I don\'t say it." Leave it with no strings attached.', category: 'self-reflection' },
        { id: 's2004-10', duration_minutes: 10, title: 'One softening act', description: 'Make tea, fold washing, prepare something ahead of time. A small act that makes their day feel easier.', category: 'action-for-partner' },
        { id: 's2004-20', duration_minutes: 20, title: 'Words that feel safe', description: 'Ask: "What kinds of words help you feel valued?" A few examples each. Keep the focus on what works.', category: 'action-with-partner' },
        { id: 's2004-60', duration_minutes: 60, title: 'A relaxed outdoor moment', description: 'Sit outside together with a drink or snack. No agenda. The aim is to unwind in each other\'s presence.', category: 'action-with-partner' },
      ]
    },
    // Day 5: Joy
    {
      day_number: 5,
      fruit_theme: 'Joy',
      tone: 'Encouraging',
      bible_reference: '1 Thessalonians 5:11',
      bible_text: {
        NIV: 'Therefore encourage one another and build each other up, just as in fact you are doing.',
        ESV: 'Therefore encourage one another and build one another up, just as you are doing.',
        KJV: 'Wherefore comfort yourselves together, and edify one another, even as also ye do.',
        NLT: 'So encourage each other and build each other up, just as you are already doing.',
        NKJV: 'Therefore comfort each other and edify one another, just as you also are doing.',
      },
      activities: [
        { id: 's2005-5', duration_minutes: 5, title: 'Journal', description: 'Think of a time your spouse encouraged you and it stayed with you. What made it land? What do you know about them that they may need to hear right now?', category: 'self-reflection' },
        { id: 's2005-5b', duration_minutes: 5, title: 'Say one encouraging thing', description: 'Say something specific: "I really appreciate this about you…" Keep it genuine and grounded in something real.', category: 'self-reflection' },
        { id: 's2005-10', duration_minutes: 10, title: 'Back it up with action', description: 'Do one practical thing that supports your spouse, especially where they seem tired or stretched.', category: 'action-for-partner' },
        { id: 's2005-20', duration_minutes: 20, title: 'Share what\'s been heavy', description: 'Ask gently: "What\'s one thing that\'s been weighing on you lately?" One answer each. Respond with encouragement only.', category: 'action-with-partner' },
        { id: 's2005-60', duration_minutes: 60, title: 'Watch something nostalgic', description: 'Choose a film or show you both used to enjoy. The aim is to reconnect through something familiar and low pressure.', category: 'action-with-partner' },
      ]
    },
    // Day 6: Self-control
    {
      day_number: 6,
      fruit_theme: 'Self-control',
      tone: 'Light Stretch',
      bible_reference: 'James 1:19',
      bible_text: {
        NIV: 'Everyone should be quick to listen, slow to speak and slow to become angry.',
        ESV: 'Know this, my beloved brothers: let every person be quick to hear, slow to speak, slow to anger;',
        KJV: 'Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath:',
        NLT: 'Understand this, my dear brothers and sisters: You must all be quick to listen, slow to speak, and slow to get angry.',
        NKJV: 'So then, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath;',
      },
      activities: [
        { id: 's2006-5', duration_minutes: 5, title: 'Journal', description: 'Where does the urge to speak before you\'ve fully listened show up most in your marriage? What would one small change in that pattern look like today?', category: 'self-reflection' },
        { id: 's2006-5b', duration_minutes: 5, title: 'Send a calm message', description: 'Send a message: "I\'d love for things to feel calmer between us. I\'m working on my part in that."', category: 'self-reflection' },
        { id: 's2006-10', duration_minutes: 10, title: 'Reduce pressure for them', description: 'Take one small responsibility off your spouse today so they have one less thing to carry.', category: 'action-for-partner' },
        { id: 's2006-20', duration_minutes: 20, title: 'Listen without interrupting', description: 'Ask: "What\'s something that\'s been on your mind?" Let them speak fully before you respond.', category: 'action-with-partner' },
        { id: 's2006-60', duration_minutes: 60, title: 'A purpose-driven outing', description: 'Drive somewhere for dessert or coffee. The aim is easy time together with a sense of going somewhere.', category: 'action-with-partner' },
      ]
    },
    // Day 7: Goodness
    {
      day_number: 7,
      fruit_theme: 'Goodness',
      tone: 'Light Stretch',
      bible_reference: 'Philippians 2:4',
      bible_text: {
        NIV: 'Be not looking to your own interests but each of you to the interests of the others.',
        ESV: 'Let each of you look not only to his own interests, but also to the interests of others.',
        KJV: 'Look not every man on his own things, but every man also on the things of others.',
        NLT: 'Don\'t look out only for your own interests, but take an interest in others, too.',
        NKJV: 'Let each of you look out not only for his own interests, but also for the interests of others.',
      },
      activities: [
        { id: 's2007-5', duration_minutes: 5, title: 'Reflect', description: 'What is your spouse carrying right now that you haven\'t fully noticed? What would it look like to turn your attention toward them today, even in one small way?', category: 'self-reflection' },
        { id: 's2007-5b', duration_minutes: 5, title: 'Ask one simple question', description: 'Ask gently: "How are you feeling today?" Allow that to be enough. No fixing needed.', category: 'self-reflection' },
        { id: 's2007-10', duration_minutes: 10, title: 'Put them first', description: 'Choose one practical action today that puts your spouse\'s needs ahead of your own.', category: 'action-for-partner' },
        { id: 's2007-20', duration_minutes: 20, title: 'Ask about their needs', description: 'Ask: "What\'s one small thing that would make today feel easier for you?" Listen and act if you can.', category: 'action-with-partner' },
        { id: 's2007-60', duration_minutes: 60, title: 'Try something they enjoy', description: 'Spend time doing something your spouse enjoys and stay curious about it. Show interest in what matters to them.', category: 'action-with-partner' },
      ]
    },
    // Day 8: Peace
    {
      day_number: 8,
      fruit_theme: 'Peace',
      tone: 'Encouraging',
      bible_reference: 'Ecclesiastes 4:9',
      bible_text: {
        NIV: 'Two are better than one, because they have a good return for their labor.',
        ESV: 'Two are better than one, because they have a good reward for their toil.',
        KJV: 'Two are better than one; because they have a good reward for their labour.',
        NLT: 'Two people are better off than one, for they can help each other succeed.',
        NKJV: 'Two are better than one, because they have a good reward for their labor.',
      },
      activities: [
        { id: 's2008-5', duration_minutes: 5, title: 'Journal', description: 'What is your spouse carrying right now that you could help with? Write about what being a genuine support to them looks like in this season.', category: 'self-reflection' },
        { id: 's2008-5b', duration_minutes: 5, title: 'Offer support in words', description: 'Say: "If you need anything today, I\'m here." Leave it open and pressure-free.', category: 'self-reflection' },
        { id: 's2008-10', duration_minutes: 10, title: 'Take something off their plate', description: 'Notice something your spouse is handling and take care of it without being asked.', category: 'action-for-partner' },
        { id: 's2008-20', duration_minutes: 20, title: 'Ask where support is needed', description: 'Ask: "What feels hardest for you right now?" Focus on understanding. Keep responses short and calm.', category: 'action-with-partner' },
        { id: 's2008-60', duration_minutes: 60, title: 'Tidy together, then rest', description: 'Spend time sorting or tidying one space together, then sit down with a drink or treat. Teamwork, then reward.', category: 'action-with-partner' },
      ]
    },
    // Day 9: Love
    {
      day_number: 9,
      fruit_theme: 'Love',
      tone: 'Encouraging',
      bible_reference: 'Ephesians 5:2',
      bible_text: {
        NIV: '...and walk in the way of love, just as Christ loved us and gave himself up for us as a fragrant offering and sacrifice to God.',
        ESV: 'And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God.',
        KJV: 'And walk in love, as Christ also hath loved us, and hath given himself for us an offering and a sacrifice to God for a sweetsmelling savour.',
        NLT: 'Live a life filled with love, following the example of Christ. He loved us and offered himself as a sacrifice for us, a pleasing aroma to God.',
        NKJV: 'And walk in love, as Christ also has loved us and given Himself for us, an offering and a sacrifice to God for a sweet-smelling aroma.',
      },
      activities: [
        { id: 's2009-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God grows compassion in you for your spouse. Ask that your spouse feels supported through you today. Pray for your marriage to become a place of genuine partnership.', category: 'self-reflection' },
        { id: 's2009-5b', duration_minutes: 5, title: 'Send a thoughtful message', description: 'Send a message: "I\'ve been thinking about you today — hope you\'re doing okay."', category: 'self-reflection' },
        { id: 's2009-10', duration_minutes: 10, title: 'Remove a distraction', description: 'Put your phone away when you\'re with your spouse today. Full presence is its own act of love.', category: 'action-for-partner' },
        { id: 's2009-20', duration_minutes: 20, title: 'When have we felt connected', description: 'Ask: "When have we felt most connected lately?" One example each. Stay focused on what has worked.', category: 'action-with-partner' },
        { id: 's2009-60', duration_minutes: 60, title: 'Go out for something simple', description: 'Head out for coffee or dessert and sit together for a while. Easy time outside your normal routine.', category: 'action-with-partner' },
      ]
    },
    // Day 10: Self-control
    {
      day_number: 10,
      fruit_theme: 'Self-control',
      tone: 'Light Stretch',
      bible_reference: 'Proverbs 25:28',
      bible_text: {
        NIV: 'Like a city whose walls are broken through is a person who lacks self-control.',
        ESV: 'A man without self-control is like a city broken into and left without walls.',
        KJV: 'He that hath no rule over his own spirit is like a city that is broken down, and without walls.',
        NLT: 'A person without self-control is like a city with broken-down walls.',
        NKJV: 'Whoever has no rule over his own spirit is like a city broken down, without walls.',
      },
      activities: [
        { id: 's2010-5', duration_minutes: 5, title: 'Reflect', description: 'A city without walls has no protection. Where in your marriage have your reactions left things exposed? What would one steadier response look like this week?', category: 'self-reflection' },
        { id: 's2010-5b', duration_minutes: 5, title: 'Use one steady phrase', description: 'In conversation today, say: "I hear you" or "That makes sense" — even when you don\'t fully agree.', category: 'self-reflection' },
        { id: 's2010-10', duration_minutes: 10, title: 'Calm one shared space', description: 'Tidy or organise one area you both use. A calmer environment reflects and reinforces a calmer mind.', category: 'action-for-partner' },
        { id: 's2010-20', duration_minutes: 20, title: 'What steadies things between us', description: 'Ask: "What helps things feel more settled between us?" One answer each. Keep it forward-facing.', category: 'action-with-partner' },
        { id: 's2010-60', duration_minutes: 60, title: 'A cosy night in', description: 'Change into comfortable clothes, get snacks, watch something together. The aim is to feel easy and settled.', category: 'action-with-partner' },
      ]
    },
    // Day 11: Gentleness
    {
      day_number: 11,
      fruit_theme: 'Gentleness',
      tone: 'Gentle',
      bible_reference: 'Philippians 4:5',
      bible_text: {
        NIV: 'Let your gentleness be evident to all. The Lord is near.',
        ESV: 'Let your reasonableness be known to everyone. The Lord is at hand;',
        KJV: 'Let your moderation be known unto all men. The Lord is at hand.',
        NLT: 'Let everyone see that you are considerate in all you do. Remember, the Lord is coming soon.',
        NKJV: 'Let your gentleness be known to all men. The Lord is at hand.',
      },
      activities: [
        { id: 's2011-5', duration_minutes: 5, title: 'Journal', description: 'When frustration rises toward your spouse, what does it usually look like? Write about one pattern you\'ve noticed and what a gentler version of that response could be.', category: 'self-reflection' },
        { id: 's2011-5b', duration_minutes: 5, title: 'Share something small', description: 'In a calm moment, say: "I realised I didn\'t tell you this…" and share something small and honest.', category: 'self-reflection' },
        { id: 's2011-10', duration_minutes: 10, title: 'Show gentleness in action', description: 'Slow down in one interaction today. Handle something with extra care. Let gentleness show in how you move and respond.', category: 'action-for-partner' },
        { id: 's2011-20', duration_minutes: 20, title: 'Share something you held back', description: 'Say: "There was something small I almost said the other day…" Share it briefly. No over-explaining.', category: 'action-with-partner' },
        { id: 's2011-60', duration_minutes: 60, title: 'A no-distraction hour', description: 'Put phones away and spend time together — talking, sitting, watching something. Focus on each other.', category: 'action-with-partner' },
      ]
    },
    // Day 12: Love
    {
      day_number: 12,
      fruit_theme: 'Love',
      tone: 'Encouraging',
      bible_reference: 'Song of Songs 8:7',
      bible_text: {
        NIV: 'Many waters cannot quench love; rivers cannot sweep it away. If one were to give all the wealth of one\'s house for love, it would be utterly scorned.',
        ESV: 'Many waters cannot quench love, neither can floods drown it. If a man offered for love all the wealth of his house, he would be utterly despised.',
        KJV: 'Many waters cannot quench love, neither can the floods drown it: if a man would give all the substance of his house for love, it would utterly be contemned.',
        NLT: 'Many waters cannot quench love, neither can floods drown it. If a man offered for love all the wealth of his house, he would be utterly despised.',
        NKJV: 'Many waters cannot quench love, nor can the floods drown it. If a man would give for love all the wealth of his house, it would be utterly despised.',
      },
      activities: [
        { id: 's2012-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God reminds you both that what you have is worth fighting for. Ask for courage to keep showing up. Pray that love proves stronger than the distance between you right now.', category: 'self-reflection' },
        { id: 's2012-5b', duration_minutes: 5, title: 'Send a message of value', description: 'Send a message: "There are things I really value about you, even when I don\'t say it."', category: 'self-reflection' },
        { id: 's2012-10', duration_minutes: 10, title: 'Act on appreciation', description: 'Do one small thing that shows appreciation — help with something they usually handle, or make their day easier.', category: 'action-for-partner' },
        { id: 's2012-20', duration_minutes: 20, title: 'What do you still value', description: 'Ask: "What\'s one thing you still value about each other?" Keep answers simple and specific.', category: 'action-with-partner' },
        { id: 's2012-60', duration_minutes: 60, title: 'A slow meal together', description: 'Prepare or order food and eat together without rushing. If you have kids, stay at the table once things settle.', category: 'action-with-partner' },
      ]
    },
    // Day 13: Goodness
    {
      day_number: 13,
      fruit_theme: 'Goodness',
      tone: 'Light Stretch',
      bible_reference: 'Micah 6:8',
      bible_text: {
        NIV: 'He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.',
        ESV: 'He has told you, O man, what is good: and what does the Lord require of you but to do justice, and to love kindness, and to walk humbly with your God?',
        KJV: 'He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?',
        NLT: 'The Lord has told you what is good: to do what is right, to love mercy, and to walk humbly with your God.',
        NKJV: 'He has shown you, O man, what is good; and what does the Lord require of you but to do justly, to love mercy, and to walk humbly with your God?',
      },
      activities: [
        { id: 's2013-5', duration_minutes: 5, title: 'Pray', description: 'Pray for a merciful heart today — toward your spouse and toward yourself. Ask God to show you one place where humility could open something that has been closed.', category: 'self-reflection' },
        { id: 's2013-5b', duration_minutes: 5, title: 'Say one kind sentence', description: 'At some point today, say simply: "I do appreciate you." Let it stand on its own.', category: 'self-reflection' },
        { id: 's2013-10', duration_minutes: 10, title: 'Make their day easier', description: 'Take over one small task your spouse would normally handle. Let the action speak without explanation.', category: 'action-for-partner' },
        { id: 's2013-20', duration_minutes: 20, title: 'What daily kindness looks like', description: 'Ask: "What small things help you feel cared for day to day?" A couple of ideas each. Keep it practical.', category: 'action-with-partner' },
        { id: 's2013-60', duration_minutes: 60, title: 'Try a new recipe together', description: 'Choose something simple neither of you has made before and cook it together. Learn something side by side.', category: 'action-with-partner' },
      ]
    },
    // Day 14: Goodness
    {
      day_number: 14,
      fruit_theme: 'Goodness',
      tone: 'Encouraging',
      bible_reference: 'Hebrews 10:24',
      bible_text: {
        NIV: 'And let us consider how we may spur one another on toward love and good deeds.',
        ESV: 'And let us consider how to stir up one another to love and good works.',
        KJV: 'And let us consider one another to provoke unto love and to good works:',
        NLT: 'Let us think of ways to motivate one another to acts of love and good works.',
        NKJV: 'And let us consider one another in order to stir up love and good works.',
      },
      activities: [
        { id: 's2014-5', duration_minutes: 5, title: 'Journal', description: 'What is still good in your marriage that is worth holding onto? Write about what you want to protect and build on, even if other things feel uncertain right now.', category: 'self-reflection' },
        { id: 's2014-5b', duration_minutes: 5, title: 'A small step toward openness', description: 'In a calm moment, say: "I\'d like for us to feel more open with each other. I want to do my part in that."', category: 'self-reflection' },
        { id: 's2014-10', duration_minutes: 10, title: 'Remove a small barrier', description: 'Follow through on something you\'ve delayed or left unfinished that may be creating distance between you.', category: 'action-for-partner' },
        { id: 's2014-20', duration_minutes: 20, title: 'What helps you feel open', description: 'Ask: "What helps you feel comfortable being honest with me?" Listen without explaining your side.', category: 'action-with-partner' },
        { id: 's2014-60', duration_minutes: 60, title: 'An evening stroll somewhere new', description: 'Walk somewhere slightly different and take your time. A fresh shared experience with no pressure attached.', category: 'action-with-partner' },
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
        ESV: 'Finally, all of you, have unity of mind, sympathy, brotherly love, a tender heart, and a humble mind.',
        KJV: 'Finally, be ye all of one mind, having compassion one of another, love as brethren, be pitiful, be courteous:',
        NLT: 'Finally, all of you should be of one mind. Sympathize with each other. Love each other as brothers and sisters. Be tenderhearted, and keep a humble attitude.',
        NKJV: 'Finally, all of you be of one mind, having compassion for one another; love as brothers, be tenderhearted, be courteous;',
      },
      activities: [
        { id: 's2015-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God restores tenderness in you. Ask that your spouse feels cared for even in imperfect moments. Pray for grace to rebuild on truth rather than pretending things are fine.', category: 'self-reflection' },
        { id: 's2015-5b', duration_minutes: 5, title: 'Say something humble', description: 'Say gently: "I know I don\'t always get this right, but I do care about us."', category: 'self-reflection' },
        { id: 's2015-10', duration_minutes: 10, title: 'Show care despite how you feel', description: 'Do something kind for your spouse today regardless of your mood. Choose the action before the feeling follows.', category: 'action-for-partner' },
        { id: 's2015-20', duration_minutes: 20, title: 'What makes things feel harder', description: 'Ask: "What tends to make things feel more difficult between us?" One example each. No blame, no defence.', category: 'action-with-partner' },
        { id: 's2015-60', duration_minutes: 60, title: 'Visit a neutral place', description: 'Go to a café, park or bookstore together. Easy company in a calm setting with no expectations.', category: 'action-with-partner' },
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
        ESV: 'Blessed are the peacemakers, for they shall be called sons of God.',
        KJV: 'Blessed are the peacemakers: for they shall be called the children of God.',
        NLT: 'God blesses those who work for peace, for they will be called the children of God.',
        NKJV: 'Blessed are the peacemakers, for they shall be called sons of God.',
      },
      activities: [
        { id: 's2016-5', duration_minutes: 5, title: 'Reflect', description: 'Where have you had the chance to bring peace into your marriage recently and taken it? Where have you missed it? What would one peacemaking choice look like today?', category: 'self-reflection' },
        { id: 's2016-5b', duration_minutes: 5, title: 'Say one peaceful sentence', description: 'When things feel tense, say: "I don\'t want this to turn into something between us." Say it and let it land.', category: 'self-reflection' },
        { id: 's2016-10', duration_minutes: 10, title: 'Do one thing that restores calm', description: 'Lower noise, reduce clutter, or create a calmer space in one small practical way.', category: 'action-for-partner' },
        { id: 's2016-20', duration_minutes: 20, title: 'What brings you peace with me', description: 'Ask: "What helps you feel peaceful with me?" Keep answers short and grounded in the everyday.', category: 'action-with-partner' },
        { id: 's2016-60', duration_minutes: 60, title: 'A music night', description: 'Play music you both enjoy or used to love and sit together. Let shared atmosphere do the work.', category: 'action-with-partner' },
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
        ESV: 'Many a man proclaims his own steadfast love, but a faithful man who can find?',
        KJV: 'Most men will proclaim every one his own goodness: but a faithful man who can find?',
        NLT: 'Many will say they are loyal friends, but who can find one who is truly reliable?',
        NKJV: 'Most men will proclaim each his own goodness, but who can find a faithful man?',
      },
      activities: [
        { id: 's2017-5', duration_minutes: 5, title: 'Journal', description: 'Faithfulness shows up in small things first. Write about one area where you could be more consistent toward your spouse this week. What would that look like in practice?', category: 'self-reflection' },
        { id: 's2017-5b', duration_minutes: 5, title: 'Reinforce trust in words', description: 'Say something simple: "I want to be someone you can rely on."', category: 'self-reflection' },
        { id: 's2017-10', duration_minutes: 10, title: 'Remove one source of doubt', description: 'Be consistent in one small action today so your spouse experiences your reliability rather than just hears about it.', category: 'action-for-partner' },
        { id: 's2017-20', duration_minutes: 20, title: 'What helps you feel secure', description: 'Ask: "What helps you feel safe and secure in our relationship?" Listen without reacting or defending.', category: 'action-with-partner' },
        { id: 's2017-60', duration_minutes: 60, title: 'Plan something to look forward to', description: 'Choose a simple future plan — a meal, an outing — and talk it through. Build a small sense of shared direction.', category: 'action-with-partner' },
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
        ESV: 'And as you wish that others would do to you, do so to them.',
        KJV: 'And as ye would that men should do to you, do ye also to them likewise.',
        NLT: 'Do to others as you would like them to do to you.',
        NKJV: 'And just as you want men to do to you, you also do to them likewise.',
      },
      activities: [
        { id: 's2018-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God helps you treat your spouse the way you want to be treated. Ask for grace to act with kindness even when it feels one-sided. Pray for growing trust between you.', category: 'self-reflection' },
        { id: 's2018-5b', duration_minutes: 5, title: 'Match your tone to your values', description: 'In your next conversation, choose a response like "I understand" or "That makes sense" to keep things steady.', category: 'self-reflection' },
        { id: 's2018-10', duration_minutes: 10, title: 'One fair and thoughtful act', description: 'Choose an action that shows fairness — share a task evenly or take your turn without being asked.', category: 'action-for-partner' },
        { id: 's2018-20', duration_minutes: 20, title: 'A moment we could revisit', description: 'Ask: "Was there a recent moment we could have handled more gently?" One example each, no blame attached.', category: 'action-with-partner' },
        { id: 's2018-60', duration_minutes: 60, title: 'A game or quiz night', description: 'Find a YouTube quiz — music, movies, trivia — and play along. The aim is to laugh and feel easy with each other.', category: 'action-with-partner' },
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
        ESV: 'Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.',
        KJV: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\'s sake hath forgiven you.',
        NLT: 'Instead, be kind to each other, tenderhearted, forgiving one another, just as God through Christ has forgiven you.',
        NKJV: 'And be kind to one another, tenderhearted, forgiving one another, even as God in Christ forgave you.',
      },
      activities: [
        { id: 's2019-5', duration_minutes: 5, title: 'Pray', description: 'Pray that the forgiveness God has shown you becomes something you can extend today. Ask for a tender heart toward your spouse. Pray that kindness comes more easily between you.', category: 'self-reflection' },
        { id: 's2019-5b', duration_minutes: 5, title: 'Acknowledge your tone', description: 'In a natural moment, say: "I\'ve noticed I\'ve been a bit short lately. I don\'t want that between us."', category: 'self-reflection' },
        { id: 's2019-10', duration_minutes: 10, title: 'One kind act regardless', description: 'Choose one simple kind action today regardless of your mood. Let the action lead.', category: 'action-for-partner' },
        { id: 's2019-20', duration_minutes: 20, title: 'Something small to release', description: 'Ask gently: "Is there anything small we can let go of today?" Keep it light and contained.', category: 'action-with-partner' },
        { id: 's2019-60', duration_minutes: 60, title: 'Get takeaway, change location', description: 'Pick up takeaway and eat somewhere different — a park, outside. Shift the environment and keep things fresh.', category: 'action-with-partner' },
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
        ESV: 'Beloved, let us love one another, for love is from God, and whoever loves has been born of God and knows God.',
        KJV: 'Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God.',
        NLT: 'Dear friends, let us continue to love one another, for love comes from God. Anyone who loves is a child of God and knows God.',
        NKJV: 'Beloved, let us love one another, for love is of God; and everyone who loves is born of God and knows God.',
      },
      activities: [
        { id: 's2020-5', duration_minutes: 5, title: 'Journal', description: 'Love comes from God, which means you can ask Him for more of it. Write about where love feels thin right now and what it would look like to bring God into that specific place.', category: 'self-reflection' },
        { id: 's2020-5b', duration_minutes: 5, title: 'Choose a loving phrase', description: 'Say something simple: "I do love you, even when things feel off between us."', category: 'self-reflection' },
        { id: 's2020-10', duration_minutes: 10, title: 'One loving act', description: 'Do one small thing that clearly shows care — make something, help with something, do something thoughtful for them today.', category: 'action-for-partner' },
        { id: 's2020-20', duration_minutes: 20, title: 'What has been working', description: 'Ask: "What\'s one thing that has felt better between us lately?" One answer each. Stay focused on what is moving in the right direction.', category: 'action-with-partner' },
        { id: 's2020-60', duration_minutes: 60, title: 'Sit together and share space', description: 'Watch something or listen to music in the same room, no phones. No pressure for conversation. Just being in the same space counts.', category: 'action-with-partner' },
      ]
    },
    // Day 21: Patience
    {
      day_number: 21,
      fruit_theme: 'Patience',
      tone: 'Light Stretch',
      bible_reference: 'Proverbs 14:29',
      bible_text: {
        NIV: 'Whoever is patient has great understanding, but one who is quick-tempered displays folly.',
        ESV: 'Whoever is slow to anger has great understanding, but he who has a hasty temper exalts folly.',
        KJV: 'He that is slow to wrath is of great understanding: but he that is hasty of spirit exalteth folly.',
        NLT: 'People with understanding control their anger; a hot temper shows great foolishness.',
        NKJV: 'He who is slow to wrath has great understanding, but he who is impulsive exalts folly.',
      },
      activities: [
        { id: 's2021-5', duration_minutes: 5, title: 'Journal', description: 'Where does impatience show up most in your marriage? Write about what is usually underneath it — and what one steadier response could look like this week.', category: 'self-reflection' },
        { id: 's2021-5b', duration_minutes: 5, title: 'Say something calming', description: 'Say gently: "We\'ll be okay. I\'d like us to work through things calmly."', category: 'self-reflection' },
        { id: 's2021-10', duration_minutes: 10, title: 'Do one thing that creates calm', description: 'Handle one situation today in a slower, calmer way than you normally would.', category: 'action-for-partner' },
        { id: 's2021-20', duration_minutes: 20, title: 'What has felt frustrating lately', description: 'Ask: "What\'s one thing that\'s been frustrating for you lately?" One answer each. Listen without fixing.', category: 'action-with-partner' },
        { id: 's2021-60', duration_minutes: 60, title: 'A calming activity together', description: 'Make tea, sit outside or listen to music side by side. Create a peaceful shared rhythm with no agenda.', category: 'action-with-partner' },
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
        ESV: 'Therefore a man shall leave his father and his mother and hold fast to his wife, and they shall become one flesh.',
        KJV: 'Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.',
        NLT: 'This explains why a man leaves his father and mother and is joined to his wife, and the two are united into one.',
        NKJV: 'Therefore a man shall leave his father and mother and be joined to his wife, and they shall become one flesh.',
      },
      activities: [
        { id: 's2022-5', duration_minutes: 5, title: 'Pray', description: 'Pray over the covenant you made. Ask God to remind you both what you are to each other. Pray that the bond between you grows stronger than the distance that has formed.', category: 'self-reflection' },
        { id: 's2022-5b', duration_minutes: 5, title: 'Reconnect with something familiar', description: 'Say: "I was thinking about when we first got together — I really valued that time with you."', category: 'self-reflection' },
        { id: 's2022-10', duration_minutes: 10, title: 'Recreate a small moment', description: 'Do something simple you used to do earlier in your relationship — make a drink, start a small routine, sit in a familiar spot.', category: 'action-for-partner' },
        { id: 's2022-20', duration_minutes: 20, title: 'One early memory', description: 'Ask: "What\'s one memory from early on that stands out to you?" Stay in it and enjoy it together.', category: 'action-with-partner' },
        { id: 's2022-60', duration_minutes: 60, title: 'Revisit a familiar favourite', description: 'Return to a place or activity you both know. Reconnect through something that already belongs to you both.', category: 'action-with-partner' },
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
        ESV: 'Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow.',
        KJV: 'Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow.',
        NLT: 'Two people are better off than one, for they can help each other succeed. If one person falls, the other can reach out and help.',
        NKJV: 'Two are better than one, because they have a good reward for their labor. For if they fall, one will lift up his companion.',
      },
      activities: [
        { id: 's2023-5', duration_minutes: 5, title: 'Journal', description: 'Where has your spouse needed support lately and you have given it? Where have you held back? Write about what showing up for each other looks like in this season.', category: 'self-reflection' },
        { id: 's2023-5b', duration_minutes: 5, title: 'Offer help directly', description: 'Say: "What\'s one thing I could help you with today?" Leave it open and mean it.', category: 'self-reflection' },
        { id: 's2023-10', duration_minutes: 10, title: 'Lighten their load', description: 'Take over one responsibility your spouse is carrying so they feel the practical difference of having you on their side.', category: 'action-for-partner' },
        { id: 's2023-20', duration_minutes: 20, title: 'What would feel like real support?', description: 'Ask: "What\'s one thing that would make you feel genuinely supported by me right now?" Listen without pushing back or offering a different answer.', category: 'action-with-partner' },
        { id: 's2023-60', duration_minutes: 60, title: 'Turn errands into shared time', description: 'Run errands together and include a small treat or pause along the way. Bring connection into the ordinary.', category: 'action-with-partner' },
      ]
    },
    // Day 24: Faithfulness
    {
      day_number: 24,
      fruit_theme: 'Faithfulness',
      tone: 'Light Stretch',
      bible_reference: 'Proverbs 27:17',
      bible_text: {
        NIV: 'As iron sharpens iron, so one person sharpens another.',
        ESV: 'Iron sharpens iron, and one man sharpens another.',
        KJV: 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.',
        NLT: 'As iron sharpens iron, so a friend sharpens a friend.',
        NKJV: 'As iron sharpens iron, so a man sharpens the countenance of his friend.',
      },
      activities: [
        { id: 's2024-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God builds faithfulness and openness in you. Ask that your spouse feels secure enough to be honest with you. Pray for a marriage where both of you make each other better.', category: 'self-reflection' },
        { id: 's2024-5b', duration_minutes: 5, title: 'Invite openness gently', description: 'Say: "If something\'s been sitting with you, I\'m open to hearing it."', category: 'self-reflection' },
        { id: 's2024-10', duration_minutes: 10, title: 'Respond with openness in action', description: 'Do one small action that shows flexibility — follow through, adjust something, be more willing than usual.', category: 'action-for-partner' },
        { id: 's2024-20', duration_minutes: 20, title: 'One thing we could do better', description: 'Ask: "What\'s one small thing we could do better as a couple?" Stay focused on solutions, not history.', category: 'action-with-partner' },
        { id: 's2024-60', duration_minutes: 60, title: 'A simple at-home evening', description: 'Set up snacks or drinks and spend the evening together without a plan. If you have kids, this works well after bedtime.', category: 'action-with-partner' },
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
        ESV: 'And above all these put on love, which binds everything together in perfect harmony.',
        KJV: 'And above all these things put on charity, which is the bond of perfectness.',
        NLT: 'Above all, clothe yourselves with love, which binds us all together in perfect harmony.',
        NKJV: 'But above all these things put on love, which is the bond of perfection.',
      },
      activities: [
        { id: 's2025-5', duration_minutes: 5, title: 'Reflect', description: 'Love is described here as something you put on — a daily choice, not just a feeling. Where have you chosen it recently? Where have you avoided it? What would choosing it look like today?', category: 'self-reflection' },
        { id: 's2025-5b', duration_minutes: 5, title: 'Say something to release tension', description: 'Say: "I don\'t want us holding onto small things. I\'d rather keep things light between us where we can."', category: 'self-reflection' },
        { id: 's2025-10', duration_minutes: 10, title: 'Show love through a small act', description: 'Do one small practical thing that shows care and kindness toward your spouse today.', category: 'action-for-partner' },
        { id: 's2025-20', duration_minutes: 20, title: 'Something small to release', description: 'Ask gently: "Is there something small we can let go of today?" Keep it simple and contained.', category: 'action-with-partner' },
        { id: 's2025-60', duration_minutes: 60, title: 'Reset the mood together', description: 'Step outside, change rooms, or shift the setting. Begin the evening again with a lighter tone.', category: 'action-with-partner' },
      ]
    },
    // Day 26: Self-control
    {
      day_number: 26,
      fruit_theme: 'Self-control',
      tone: 'Light Stretch',
      bible_reference: 'Proverbs 18:13',
      bible_text: {
        NIV: 'To answer before listening — that is folly and shame.',
        ESV: 'If one gives an answer before he hears, it is his folly and shame.',
        KJV: 'He that answereth a matter before he heareth it, it is folly and shame unto him.',
        NLT: 'Spouting off before listening to the facts is both shameful and foolish.',
        NKJV: 'He who answers a matter before he hears it, it is folly and shame to him.',
      },
      activities: [
        { id: 's2026-5', duration_minutes: 5, title: 'Journal', description: 'Think about the last conversation with your spouse where you responded before they had finished. What were you actually reacting to? What would full listening have changed?', category: 'self-reflection' },
        { id: 's2026-5b', duration_minutes: 5, title: 'Show you are listening', description: 'Say: "I do want to understand you better. I\'m listening."', category: 'self-reflection' },
        { id: 's2026-10', duration_minutes: 10, title: 'Listen through action', description: 'Put your phone away when your spouse is speaking today. Full attention is its own kind of respect.', category: 'action-for-partner' },
        { id: 's2026-20', duration_minutes: 20, title: 'Give them the floor', description: 'Ask: "Is there something you\'d like me to hear more clearly?" Let them speak fully before you respond.', category: 'action-with-partner' },
        { id: 's2026-60', duration_minutes: 60, title: 'Chat then settle into something', description: 'Spend time talking about something light, then move into a show or activity together. Balance conversation with ease.', category: 'action-with-partner' },
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
        ESV: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
        KJV: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
        NLT: 'Trust in the Lord with all your heart; do not depend on your own understanding. Seek his will in all you do, and he will show you which path to take.',
        NKJV: 'Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.',
      },
      activities: [
        { id: 's2027-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God directs your marriage where your own understanding has run out. Ask for the humility to trust Him with what you cannot fix. Pray for small signs of His faithfulness today.', category: 'self-reflection' },
        { id: 's2027-5b', duration_minutes: 5, title: 'Acknowledge growth', description: 'Say: "I\'m trying to do things differently, even in small ways. I want you to know that."', category: 'self-reflection' },
        { id: 's2027-10', duration_minutes: 10, title: 'One visible change', description: 'Choose one small behaviour to change today and act on it. Let the change speak for itself.', category: 'action-for-partner' },
        { id: 's2027-20', duration_minutes: 20, title: 'One habit to grow toward', description: 'Ask: "What\'s one small thing we\'d each like to move toward as a couple?" One answer each, forward-facing.', category: 'action-with-partner' },
        { id: 's2027-60', duration_minutes: 60, title: 'Easy conversation tonight', description: 'Choose topics like travel, food or "what would we do if" and keep it playful. Let the evening feel light.', category: 'action-with-partner' },
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
        ESV: 'May the God of endurance and encouragement grant you to live in such harmony with one another, in accord with Christ Jesus.',
        KJV: 'Now the God of patience and consolation grant you to be likeminded one toward another according to Christ Jesus.',
        NLT: 'May God, who gives this patience and encouragement, help you live in complete harmony with each other, as is fitting for followers of Christ Jesus.',
        NKJV: 'Now may the God of patience and comfort grant you to be like-minded toward one another, according to Christ Jesus.',
      },
      activities: [
        { id: 's2028-5', duration_minutes: 5, title: 'Pray', description: 'Pray this verse over your marriage today. Ask God for the endurance to keep going and the encouragement to believe things can change. Pray for harmony that comes from Him, not just effort.', category: 'self-reflection' },
        { id: 's2028-5b', duration_minutes: 5, title: 'Put them first in words', description: 'Say: "I want to be more aware of what you need. I\'m working on that."', category: 'self-reflection' },
        { id: 's2028-10', duration_minutes: 10, title: 'Support them visibly', description: 'Do something today that clearly shows your spouse they matter — especially in something that is important to them.', category: 'action-for-partner' },
        { id: 's2028-20', duration_minutes: 20, title: 'How can I support you better', description: 'Ask: "What\'s one way I could support you better right now?" Receive the answer openly without defending.', category: 'action-with-partner' },
        { id: 's2028-60', duration_minutes: 60, title: 'Try something slightly new', description: 'Visit a new café, try a new snack, or explore somewhere unfamiliar. A small dose of novelty and shared discovery.', category: 'action-with-partner' },
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
        ESV: 'Aim for restoration, comfort one another, agree with one another, live in peace.',
        KJV: 'Be perfect, be of good comfort, be of one mind, live in peace.',
        NLT: 'Aim for harmony, comfort each other, and live in peace.',
        NKJV: 'Become complete. Be of good comfort, be of one mind, live in peace.',
      },
      activities: [
        { id: 's2029-5', duration_minutes: 5, title: 'Pray', description: 'Pray for restoration in your marriage — not perfection, but movement toward each other. Ask God to bring comfort where there has been hurt. Pray that peace becomes the atmosphere between you.', category: 'self-reflection' },
        { id: 's2029-5b', duration_minutes: 5, title: 'Say something that brings peace', description: 'Say gently: "I\'d really like things to feel easier between us. I believe they can."', category: 'self-reflection' },
        { id: 's2029-10', duration_minutes: 10, title: 'One comforting act', description: 'Do one small thing that brings comfort — make a drink, help with something they are handling, ease one thing for them.', category: 'action-for-partner' },
        { id: 's2029-20', duration_minutes: 20, title: 'What brings peace between us', description: 'Ask: "What helps you feel at peace in our relationship?" One or two answers each. Receive them well.', category: 'action-with-partner' },
        { id: 's2029-60', duration_minutes: 60, title: 'Wind down together', description: 'Spend the last part of the evening in the same space with low energy and easy conversation. End the day feeling settled.', category: 'action-with-partner' },
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
        ESV: 'He heals the brokenhearted and binds up their wounds.',
        KJV: 'He healeth the broken in heart, and bindeth up their wounds.',
        NLT: 'He heals the brokenhearted and bandages their wounds.',
        NKJV: 'He heals the brokenhearted and binds up their wounds.',
      },
      activities: [
        { id: 's2030-5', duration_minutes: 5, title: 'Pray', description: 'Pray that God does what only He can do in your marriage. Thank Him for the ground you have covered. Ask Him to continue the healing — in you, in your spouse, and between you both.', category: 'self-reflection' },
        { id: 's2030-5b', duration_minutes: 5, title: 'Speak hope over your marriage', description: 'Say: "I\'m glad we are still here. I believe God is working in this."', category: 'self-reflection' },
        { id: 's2030-10', duration_minutes: 10, title: 'Show repair through action', description: 'Do one practical thing that shows you care and want things to be better — follow through, ease something, show up well.', category: 'action-for-partner' },
        { id: 's2030-20', duration_minutes: 20, title: 'A simple shared acknowledgement', description: 'Say to each other: "One thing I have appreciated about you over these days is…" Keep it genuine and brief.', category: 'action-with-partner' },
        { id: 's2030-60', duration_minutes: 60, title: 'End with something calm', description: 'Spend the final part of the evening in the same space, unhurried. Let the day close with a sense of peace and arrival.', category: 'action-with-partner' },
      ]
    },
  ],
  family: [],
};
