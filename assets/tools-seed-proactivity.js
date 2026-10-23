/* VideoBanao Free — VERIFIED SEED DATA (proactivity research run, 2026-10-23 ~19:00 IST)
 *
 * WHAT: 19 flagship AI video tools as window.VB_TOOLS_SEED records, in the same
 * shape the directory renderer + build.mjs consume (name, slug, cat, price,
 * rating, rc, logo, url, descEn, descHi, best, featured).
 *
 * VERIFICATION (done 2026-10-23 via web search, sources in ratingSrc/urlNote):
 *  - Pricing tiers checked against Oct 2026 comparison coverage
 *    (rankup4u.com, brightseotools.com, blutoolboxhq.com, toolchase.com,
 *    itechguides.com, heygen.com/blog, coursebox.ai, concurate.com,
 *    techreviewer.co, saasworthy.com, spotsaas.com, whataitools.co.uk).
 *  - Star ratings are NEVER invented: every rating carries its source.
 *    ratingSrc = "g2" (verified user reviews) or the editorial source.
 *    rc = review count where the source gave one, else 0.
 *  - urlVerified=true only where the exact official URL appeared verbatim in
 *    sources. Others are high-confidence but MUST be re-verified before publish.
 *
 * LOGOS: interim = each brand's own favicon via Google's favicon service
 * (the brand's own mark; renderer already falls back to a letter tile on
 * error). Upgrade to full official brand logos before launch per Morris's
 * "har tool ka original logo" rule.
 *
 * IMPORTANT EXCLUSION: OpenAI Sora is DEAD — consumer app shut April 2026,
 * API sunsetting 24 Sep 2026 (rankup4u.com, Oct 2026). Do NOT list Sora.
 * Luma has NO free individual plan since the March 2026 restructure
 * (only a limited daily web allowance) — do not show it as fully free.
 *
 * MERGE: append these records into assets/tools-data.js (window.VB_TOOLS=[...])
 * when the merge pipeline runs; slugs are unique and URL-safe.
 */
window.VB_TOOLS_SEED = [
{
"name": "Runway",
"slug": "runway",
"cat": "text-to-video",
"price": "Freemium",
"rating": 4.1,
"rc": 105,
"ratingSrc": "G2 user rating (105 reviews, checked Oct 2026)",
"url": "https://runwayml.com",
"urlVerified": true,
"logo": "https://www.google.com/s2/favicons?domain=runwayml.com&sz=128",
"descEn": "Text-to-video with the Gen-4.5 model plus a full editing suite — Motion Brush, inpainting and rival models in one workspace. Free: 125 one-time credits; paid from $12/mo (annual).",
"descHi": "Gen-4.5 model se text-to-video aur poora editing suite — Motion Brush, inpainting, sab ek hi workspace me. Free: 125 one-time credits; paid $12/mo (annual) se.",
"best": "Creators and filmmakers who want control over every shot",
"featured": true
},
{
"name": "Kling AI",
"slug": "kling-ai",
"cat": "text-to-video",
"price": "Freemium",
"rating": 4.5,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 8.9/10 (Oct 2026)",
"url": "https://kling.ai",
"urlVerified": true,
"logo": "https://www.google.com/s2/favicons?domain=kling.ai&sz=128",
"descEn": "Kuaishou's Kling 3.0 — realistic motion with native audio and lip-synced dialogue, clips up to 15 seconds. Free: 66 credits/day; paid from ~$7/mo.",
"descHi": "Kuaishou ka Kling 3.0 — realistic motion, lip-sync wali native audio, 15 second tak ke clips. Free: roz 66 credits; paid ~$7/mo se.",
"best": "Realistic clips on a budget",
"featured": true
},
{
"name": "Luma Dream Machine",
"slug": "luma-dream-machine",
"cat": "text-to-video",
"price": "Freemium",
"rating": 3.8,
"rc": 0,
"ratingSrc": "whataitools.co.uk editorial 7.5/10 (Oct 2026)",
"url": "https://lumalabs.ai",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=128",
"descEn": "Ray models with natural motion and keyframe camera control — strong at image-to-video. Limited free daily web allowance; Agents plan from $30/mo (no free individual plan since Mar 2026).",
"descHi": "Ray models — natural motion aur keyframe camera control, image-to-video me strong. Roz limited free allowance; Agents plan $30/mo se.",
"best": "Cinematic camera moves",
"featured": false
},
{
"name": "Pika",
"slug": "pika",
"cat": "text-to-video",
"price": "Freemium",
"rating": 4.3,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 8.5/10 (Oct 2026)",
"url": "https://pika.art",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=pika.art&sz=128",
"descEn": "Fast, effect-driven short clips with Pikaffects and trend templates — built for social. Free plan watermarked (480p); paid from $8/mo.",
"descHi": "Pikaffects aur trend templates ke saath tez short clips — social media ke liye bana hai. Free plan watermarked (480p); paid $8/mo se.",
"best": "Fun short social clips",
"featured": false
},
{
"name": "Hailuo AI",
"slug": "hailuo-ai",
"cat": "text-to-video",
"price": "Freemium",
"rating": 4.2,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 8.3/10 (Oct 2026)",
"url": "https://hailuoai.video",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=hailuoai.video&sz=128",
"descEn": "MiniMax's Hailuo — expressive character motion with daily free credits, no card needed to start. Paid roughly $8–15/mo.",
"descHi": "MiniMax ka Hailuo — expressive character motion, roz free credits, shuru karne ke liye card nahi chahiye. Paid lagbhag $8–15/mo.",
"best": "Free daily experimentation",
"featured": false
},
{
"name": "PixVerse",
"slug": "pixverse",
"cat": "text-to-video",
"price": "Freemium",
"rating": 3.9,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 7.8/10 (Oct 2026)",
"url": "https://pixverse.ai",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=pixverse.ai&sz=128",
"descEn": "Quick text- and image-to-video generation with playful effects and templates.",
"descHi": "Playful effects aur templates ke saath tez text/image-to-video generation.",
"best": "Fast meme-style clips",
"featured": false
},
{
"name": "Google Veo 3.1",
"slug": "google-veo",
"cat": "text-to-video",
"price": "Freemium",
"rating": 4.7,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 9.4/10 (Oct 2026)",
"url": "https://labs.google/fx",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=labs.google&sz=128",
"descEn": "Google's most realistic video model — native dialogue and synced audio, available via Gemini/Flow. Limited access on Google AI Pro ($19.99/mo).",
"descHi": "Google ka sabse realistic video model — native dialogue aur synced audio, Gemini/Flow se. Google AI Pro ($19.99/mo) par limited access.",
"best": "Photorealistic clips with sound",
"featured": false
},
{
"name": "Higgsfield",
"slug": "higgsfield",
"cat": "text-to-video",
"price": "Freemium",
"rating": 4.2,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 8.4/10 (Oct 2026)",
"url": "https://higgsfield.ai",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=higgsfield.ai&sz=128",
"descEn": "Social-first AI video with cinematic camera moves and character consistency. Free tier; paid from ~$9/mo.",
"descHi": "Cinematic camera moves ke saath social-first AI video. Free tier; paid ~$9/mo se.",
"best": "Cinematic social videos",
"featured": false
},
{
"name": "InVideo AI",
"slug": "invideo-ai",
"cat": "ai-video-editors",
"price": "Freemium",
"rating": 4.3,
"rc": 179,
"ratingSrc": "G2 user rating (179 reviews, via techreviewer.co Aug 2026)",
"url": "https://invideo.io",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=invideo.io&sz=128",
"descEn": "Describe your idea and get a full video — stock footage, voiceover, subtitles and music included. Free plan watermarked; paid from ~$17/mo.",
"descHi": "Apna idea likho, poori video taiyaar — stock footage, voiceover, subtitles, music sab included. Free plan watermarked; paid ~$17/mo se.",
"best": "Marketing and YouTube videos, fast",
"featured": true
},
{
"name": "HeyGen",
"slug": "heygen",
"cat": "avatar-presenter",
"price": "Freemium",
"rating": 4.8,
"rc": 1967,
"ratingSrc": "G2 user rating (1,967 reviews, Sep 2026 via coursebox.ai)",
"url": "https://heygen.com",
"urlVerified": true,
"logo": "https://www.google.com/s2/favicons?domain=heygen.com&sz=128",
"descEn": "AI avatars with 175+ languages of lip-synced translation and instant avatar cloning. Free: 3 videos/mo; Creator $29/mo.",
"descHi": "175+ bhashaon me lip-sync wale AI avatars aur instant avatar cloning. Free: mahine me 3 videos; Creator $29/mo.",
"best": "Talking-head avatar videos",
"featured": true
},
{
"name": "Synthesia",
"slug": "synthesia",
"cat": "avatar-presenter",
"price": "Freemium",
"rating": 4.6,
"rc": 2804,
"ratingSrc": "G2 user rating (2,804 reviews, Sep 2026 via coursebox.ai)",
"url": "https://synthesia.io",
"urlVerified": true,
"logo": "https://www.google.com/s2/favicons?domain=synthesia.io&sz=128",
"descEn": "240+ avatars and 140+ languages — the corporate standard for training and explainer videos. Free Basic: 10 min/mo watermarked; from $29/mo.",
"descHi": "240+ avatars, 140+ bhashaen — training aur explainer videos ka corporate standard. Free Basic: 10 min/mo watermarked; $29/mo se.",
"best": "Corporate training videos",
"featured": true
},
{
"name": "Pictory",
"slug": "pictory",
"cat": "faceless",
"price": "Paid",
"rating": 4.3,
"rc": 155,
"ratingSrc": "SpotSaaS aggregated user rating (155 reviews, 2026)",
"url": "https://pictory.ai",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=pictory.ai&sz=128",
"descEn": "Turn scripts or blog posts into faceless videos with AI voiceover and stock visuals. Paid from ~$19/mo (free trial available).",
"descHi": "Script ya blog post se faceless video — AI voiceover aur stock visuals ke saath. Paid ~$19/mo se (free trial milta hai).",
"best": "Faceless YouTube videos",
"featured": true
},
{
"name": "Fliki",
"slug": "fliki",
"cat": "faceless",
"price": "Freemium",
"rating": 4.8,
"rc": 55,
"ratingSrc": "SaaSworthy user rating, G2-sourced (55 ratings, 2026)",
"url": "https://fliki.ai",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=fliki.ai&sz=128",
"descEn": "Script-based video maker with lifelike AI voices and a big stock library. Free plan; paid from ~$28/mo.",
"descHi": "Lifelike AI voices aur badi stock library ke saath script-based video maker. Free plan; paid ~$28/mo se.",
"best": "Voiceover-led videos",
"featured": false
},
{
"name": "DeepBrain AI Studios",
"slug": "deepbrain-ai-studios",
"cat": "avatar-presenter",
"price": "Freemium",
"rating": 4.7,
"rc": 77,
"ratingSrc": "G2 user rating (77+ reviews, via heygen.com comparison Oct 2026)",
"url": "https://deepbrain.io",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=deepbrain.io&sz=128",
"descEn": "Realistic AI presenters in 150+ languages. Free: 3 videos/mo (3 min each); paid from $29/mo.",
"descHi": "150+ bhashaon me realistic AI presenters. Free: mahine me 3 videos; paid $29/mo se.",
"best": "Multilingual presenter videos",
"featured": false
},
{
"name": "Colossyan",
"slug": "colossyan",
"cat": "avatar-presenter",
"price": "Paid",
"rating": 4.6,
"rc": 0,
"ratingSrc": "concurate.com review (2026)",
"url": "https://colossyan.com",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=colossyan.com&sz=128",
"descEn": "Text-to-avatar videos built for workplace learning, with quizzes and branching. Trial available; paid from ~$27/mo.",
"descHi": "Workplace learning ke liye text-to-avatar videos — quizzes ke saath. Trial milta hai; paid ~$27/mo se.",
"best": "Workplace learning videos",
"featured": false
},
{
"name": "Vidnoz",
"slug": "vidnoz",
"cat": "avatar-presenter",
"price": "Freemium",
"rating": 3.3,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 6.6/10 (Oct 2026)",
"url": "https://vidnoz.com",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=vidnoz.com&sz=128",
"descEn": "Free AI avatar video generator with daily credits and 720p downloads. Paid from ~$27/mo.",
"descHi": "Daily credits aur 720p download ke saath free AI avatar video generator. Paid ~$27/mo se.",
"best": "Free avatar experiments",
"featured": false
},
{
"name": "Magic Hour",
"slug": "magic-hour",
"cat": "ai-animation",
"price": "Freemium",
"rating": 3.4,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 6.8/10 (Oct 2026)",
"url": "https://magichour.ai",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=magichour.ai&sz=128",
"descEn": "Playground of AI video tools — face swap, animation and effects. Free: 400 credits + 100/day; paid from $10/mo (annual).",
"descHi": "AI video tools ka playground — face swap, animation, effects. Free: 400 credits + roz 100; paid $10/mo (annual) se.",
"best": "Fun AI effects",
"featured": false
},
{
"name": "Lumen5",
"slug": "lumen5",
"cat": "slideshow",
"price": "Freemium",
"rating": 3.3,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 6.5/10 (Oct 2026)",
"url": "https://lumen5.com",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=lumen5.com&sz=128",
"descEn": "Turn articles and blog posts into social videos automatically.",
"descHi": "Articles aur blog posts se automatic social videos.",
"best": "Turning articles into videos",
"featured": false
},
{
"name": "Creatify",
"slug": "creatify",
"cat": "ads-ugc",
"price": "Paid",
"rating": 3.4,
"rc": 0,
"ratingSrc": "itechguides.com editorial score 6.7/10 (Oct 2026)",
"url": "https://creatify.ai",
"urlVerified": false,
"logo": "https://www.google.com/s2/favicons?domain=creatify.ai&sz=128",
"descEn": "AI video ads and UGC-style clips generated straight from a product link. Paid from ~$39/mo.",
"descHi": "Product link se seedha AI video ads aur UGC-style clips. Paid ~$39/mo se.",
"best": "E-commerce video ads",
"featured": false
}
];
