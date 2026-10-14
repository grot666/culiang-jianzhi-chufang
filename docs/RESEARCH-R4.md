# RESEARCH round 4 — 2026-10-15 (SGT)
(Continuation of docs/RESEARCH.md; kept separate to keep commits small.)

## R4.1 More USDA FDC values — VERIFIED via official FDC API (SR Legacy, per 100 g)
Source: `https://api.nal.usda.gov/fdc/v1/foods?fdcIds=171287,173424,175180,172475,169705,168483,175168,169251,170419,169967,168462,171705&format=abridged` queried 2026-10-15. Human link: `https://fdc.nal.usda.gov/food-details/<id>/nutrients`.

| Food (FDC id) | kcal | P | F | C | fiber |
|---|---|---|---|---|---|
| Egg, whole, raw (171287) | 143 | 12.6 | 9.51 | 0.72 | 0 |
| Egg, whole, hard-boiled (173424) | 155 | 12.6 | 10.6 | 1.12 | 0 |
| Shrimp, cooked (175180) | 99 | 24.0 | 0.28 | 0.20 | — |
| Tofu, firm, raw, calcium sulfate (172475) | 144 | 17.3 | 8.72 | 2.78 | 2.3 |
| Salmon, Atlantic farmed, cooked dry heat (175168) | 206 | 22.1 | 12.4 | 0 | 0 |
| Oats, dry (169705) | 389 | 16.9 | 6.90 | 66.3 | 10.6 |
| Sweet potato, baked, flesh (168483) | 90 | 2.01 | 0.15 | 20.7 | 3.3 |
| Broccoli, boiled, drained (169967) | 35 | 2.38 | 0.41 | 7.18 | 3.3 |
| Spinach, raw (168462) | 23 | 2.86 | 0.39 | 3.63 | 2.2 |
| Mushrooms, white, raw (169251) | 22 | 3.09 | 0.34 | 3.26 | 1.0 |
| Peas, green, raw (170419) | 81 | 5.42 | 0.40 | 14.4 | 5.7 |
| Avocado, raw (171705) | 160 | 2.00 | 14.7 | 8.53 | 6.7 |

Caveat: Chinese tofu (北豆腐/南豆腐) varies; prefer 中国食物成分表 values when the engineer has them, else mark this USDA proxy `verified:false` for 南豆腐.

## R4.2 Audit of the owner's own sample day (arithmetic on R3.1/R4.1 values)
Assumed day from his plan: 3 eggs (150 g raw), 400 g cooked white rice, 360 g cooked skinless thigh (3 × 120 g), 100 g light tuna, 300 g broccoli + 200 g carrot (raw wt), 15 g oil.

| | kcal | P g | F g | C g | fiber g |
|---|---|---|---|---|---|
| eggs 150 g | 215 | 18.9 | 14.3 | 1.1 | 0 |
| white rice 400 g | 520 | 10.8 | 1.1 | 112.8 | 1.6 |
| thigh 360 g | 644 | 89.3 | 29.3 | 0 | 0 |
| light tuna 100 g | 86 | 19.4 | 1.0 | 0 | 0 |
| broccoli 300 g + carrot 200 g | 184 | 10.3 | 1.6 | 39.1 | 13.4 |
| oil 15 g | 133 | 0 | 15.0 | 0 | 0 |
| **Total** | **≈1782** | **≈149** | **≈62** | **≈153** | **≈15** |

Findings:
- kcal (≈1780), protein (≈149 g) and fat (≈62 g) all land inside his plan's targets (1700–2000 / 130–160 / 50–70). **His plan is internally consistent — a good default template.**
- **Fiber ≈ 15 g is well below PROMPT's 25–30 g target.** Swapping half the white rice for brown rice adds only ≈2.4 g (R3.1). Closing the gap needs e.g. 40 g oats in the breakfast porridge (+4.2 g), 100 g peas (+5.7 g), more leafy veg, or fruit (2 kiwis also serve R3.5).
- With PROMPT's gut-comfort guard (§2.5), high protein + low fiber is exactly the constipation-risk pattern — relevant if he adds protein powder.

## R4.3 30-min wrist-friendly evening workflow (design proposal built from R1.3/R1.5/R3.4; timings are estimates to user-test, not sourced)
1. 0–3 min: rinse rice + grains, rice cooker on (no soaking needed for 小米/燕麦米; soak 糙米 in the morning). Use measuring cup, pour with two hands.
2. 3–10 min: boneless skinless thigh (buy pre-trimmed) + 净菜/frozen veg into one lined tray; weigh oil into a bowl and toss with spatula, not by wrist-flicking.
3. 10–30 min: oven/air fryer roasts unattended; meanwhile eat tonight's dinner (keeps dinner ≥ 3 h before bed if started early).
4. 30–45 min passive: spread rice in shallow boxes to cool within 1 h → fridge (R1.3). Portion protein/veg into boxes for tomorrow.
Tools to suggest: rice cooker, air fryer or oven + parchment, kitchen scale, pull-tab cans/lever can opener, pre-cut produce, lightweight boxes; avoid heavy cast-iron/wok tossing.
