# RESEARCH.md — 需求与营养研究 (needs-research worker)

Docs only. Every number below has a source URL; if a value isn't sourced here, treat it as unverified.
User profile source: owner's plan doc (Drive) — male, 29y, 173.5 cm, 74 kg, est. body fat 25–30%, goal 58 kg by 2027-07-31, TFCC wrist injury, poor sleep, likes chicken thigh / rice / canned tuna / roasted veg, ~30 min evening batch prep (cooks next day's breakfast+lunch at night).

---

## Round 1 — 2026-10-15 (SGT)

### R1.1 Goal feasibility: rate is fine, end-point is very lean
- 74 → 58 kg over ~41 weeks = ~0.39 kg/week ≈ 0.53% BW/week at start, ~0.67%/week near the end (arithmetic).
- ISSN suggests ~0.5–1.0% BW/week to retain lean mass; slower is better as people get leaner (Garthe: 0.7%/wk beat 1.4%/wk).
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/ (ISSN 2017, diets & body composition)
  - https://www.tandfonline.com/doi/full/10.1080/15502783.2026.2740266 (ISSN 2026, diets for body weight reduction)
- **But the end-point:** at 25–30% BF, fat mass ≈ 18.5–22.2 kg, lean ≈ 51.8–55.5 kg (arithmetic). Reaching 58 kg with *zero* lean loss implies ending at ≈ 4–11% BF; BMI at 58 kg/173.5 cm ≈ 19.3. So "58 kg AND keep all muscle" is likely not simultaneously achievable; some lean loss is expected, or the goal weight should be re-evaluated around 62–64 kg using waist/photos, not scale only.
- **Product implication:** app should show projected body-fat % at goal weight, and a pace check against 0.5–1%/wk (PROMPT §7 already warns at >1%/wk).

### R1.2 Protein: his plan (130–160 g) vs. app default (1.6 g/kg → ~118 g)
- Helms et al. 2014: energy-restricted resistance-trained people likely need 2.3–3.1 g/kg **fat-free mass**, scaled up with leanness/deficit severity. https://journals.humankinetics.com/view/journals/ijsnem/24/2/article-p127.xml
- Later review: 1.6–2.4 g/kg BW in deficit. https://journals.humankinetics.com/view/journals/ijsnem/28/2/article-p170.xml
- For FFM 52–55 kg: 2.3–3.1 g/kg FFM ≈ 120–170 g/day — his plan's 130–160 g sits inside; app default 1.6 g/kg × 74 ≈ 118 g sits at the bottom.
- **Implication:** offer an FFM-based mode (needs BF% estimate) and let the user's plan value override.

### R1.3 Batch-cooked rice: food safety is a hard requirement
- He cooks ~400 g rice at night for the next day. UK FSA/NHS: cool cooked rice quickly, ideally within 1 hour (spread out / small portions; don't leave in the cooker), refrigerate, eat within 24 h, reheat only once until steaming hot. Bacillus cereus spores survive cooking; toxins aren't destroyed by reheating.
  - https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker
  - https://www.nhs.uk/best-start-in-life/baby/weaning/safe-weaning/storing-and-reheating-food/
- Bonus (weak evidence): cooked white rice chilled 24 h at 4°C then reheated had more resistant starch (0.64 → 1.65 g/100 g) and lower glycemic response in 15 adults. https://apjcn.qdu.edu.cn/24_4_24.pdf . Present as "may help", not a claim.

### R1.4 Sleep: don't eat the big meal right before bed
- RCT (13 young women): ~700 kcal dinner 1 h before bed → shorter sleep, more wake after sleep onset vs. 5 h before. Another study (20 adults) found little change in architecture. Evidence is small/mixed.
  - https://link.springer.com/article/10.1186/s40101-026-00430-0
  - https://www.dovepress.com/effects-of-dinner-timing-on-sleep-stage-distribution-and-eeg-power-spe-peer-reviewed-fulltext-article-NSS
- **Implication:** since evening = cooking time, the app should separate "prep time" from "dinner time" and nudge dinner ≥ 2–3 h before bed (user-set bedtime). Tasting while cooking counts.

### R1.5 Wrist (TFCC): kitchen-motion constraints
- TFCC management advice: avoid ulnar-side loading combined with forearm rotation, forceful gripping, heavy lifting/carrying, jar opening; keep wrist near neutral.
  - https://www.handtherapyacademy.com/treatments/management-of-a-tfcc-injury-in-hand-therapy/
  - https://ifsht.org/wp-content/uploads/2022/03/Hand-Therapy-contribution-from-EZINE-issue-45-february-2022.pdf
- Kitchen translation (practical, not clinical): no wok tossing / one-hand heavy pan lifts; prefer sheet-pan oven/air-fryer roasting, rice cooker, microwave steaming; buy pre-cut 净菜 / frozen veg / boneless thigh; use pull-tab cans or a lever opener; two-handed lifts; rocking knife motion over chopping force.
- **Implication:** recipes get a 护腕 tag/score.

### R1.6 Data for his staples — see R3.1 for the FDC-API-verified table (supersedes this).

---

## Round 2 — 2026-10-15 (SGT)

### R2.1 Coarse grains: the win is fiber/GI, not calories
- Cooked, per 100 g: white rice 130 kcal, brown rice 123, millet 119 (now verified via FDC API, see R3.1).
- GI (Atkinson et al. 2021 international tables, glucose = 100): white rice avg 73, brown rice avg 65, oat products avg 55; low ≤55, medium 56–69, high ≥70. Values vary a lot by variety/processing (e.g. some foxtail-millet products ≥76). https://ajcn.nutrition.org/article/S0002-9165(22)00494-4/fulltext
- His plan: ~400 g cooked rice/day ≈ 520 kcal ≈ 29% of an 1800 kcal target. Swapping white for a 杂粮饭 blend barely changes kcal per gram.
- **Implication:** the 杂粮饭 mixer must not imply coarse grains are "lower calorie"; show kcal unchanged, fiber up, GI band shifting (approximate). Portion size of cooked rice is the main kcal lever.

---

## Round 3 — 2026-10-15 (SGT)

### R3.1 USDA FDC values — VERIFIED against the official FDC API (SR Legacy, per 100 g)
Queried `https://api.nal.usda.gov/fdc/v1/foods?fdcIds=...&format=abridged` (DEMO_KEY) on 2026-10-15. Engineer may mark these `verified: true` with `source: "USDA FDC <id>"`.

| Food (FDC id) | kcal | P | F | C | fiber |
|---|---|---|---|---|---|
| Chicken thigh, meat only, roasted (172388) | 179 | 24.8 | 8.15 | 0 | 0 |
| Chicken breast, meat only, roasted (171477) | 165 | 31.0 | 3.57 | 0 | 0 |
| Tuna, light, canned in water, drained (173709) | 86 | 19.4 | 0.96 | 0 | 0 |
| Tuna, white (albacore), canned in water, drained (175158) | 128 | 23.6 | 2.97 | 0 | 0 |
| Rice, white, long-grain, enriched, cooked (168878) | 130 | 2.69 | 0.28 | 28.2 | 0.4 |
| Rice, brown, long-grain, cooked (169704) | 123 | 2.74 | 0.97 | 25.6 | 1.6 |
| Millet, cooked (168871) | 119 | 3.51 | 1.00 | 23.7 | 1.3 |
| Broccoli, raw (170379) | 34 | 2.82 | 0.37 | 6.64 | 2.6 |
| Carrots, raw (170393) | 41 | 0.93 | 0.24 | 9.58 | 2.8 |
| Oil, olive (171413) | 884 | 0 | 100 | 0 | 0 |

Note: FDC's web URL `fdc-app.html#/...` returns 404 to fetchers; use `https://fdc.nal.usda.gov/food-details/<id>/nutrients` as the human link.

### R3.2 Chicken thigh vs breast: the cost of "tastier" is small
- Per 30 g protein (arithmetic from R3.1): thigh ≈ 121 g cooked → ≈217 kcal, ≈9.9 g fat; breast ≈ 97 g → ≈160 kcal, ≈3.5 g fat. Difference ≈ 57 kcal and ≈6 g fat per 30 g protein.
- His plan prefers thigh (taste, price). At ~3 portions/day the gap is ~170 kcal / ~19 g fat — meaningful against a 50–70 g fat budget, but a fair trade if it keeps adherence. Must remove skin (skin is "low-value fat" per PROMPT §2.4).
- **Implication:** fat wallet should show thigh as "高性价比脂肪" vs. skin/fried as low-value; plate builder can offer a mixed thigh+breast option.

### R3.3 Tuna and mercury
- FDA/EPA: canned light tuna (incl. skipjack) = "Best Choice"; albacore/white and yellowfin = "Good Choice"; bigeye = avoid. Albacore typically has ~3× the mercury of canned light. Numeric servings (2–3 × 4 oz/113 g per week of Best Choices, or 1 Good Choice and no other fish) are written for pregnant/breastfeeding people and children; for general adults the DGA says ≥ 8 oz seafood/week.
  - https://www.fda.gov/food/consumers/advice-about-eating-fish
  - https://www.fda.gov/food/consumers/questions-answers-fdaepa-advice-about-eating-fish-those-who-might-become-or-are-pregnant-or
  - https://www.epa.gov/choose-fish-and-shellfish-wisely/epa-fda-advice-about-eating-fish-and-shellfish
- His plan uses tuna as a daily snack option. For a general adult there's no hard FDA cap, but a conservative app default is sensible.
- **Implication:** track tuna type (淡金枪鱼/白金枪鱼); weekly counter with a soft note when light tuna > 3 × 113 g or albacore > 1 × 113 g per week (labelled "保守参考，来自 FDA 对敏感人群的建议"), and suggest rotating with shrimp/salmon/鲳鱼 (all Best Choice).

### R3.4 Roasted-veg oil: the hidden fat line
- Olive oil 884 kcal/100 g (FDC 171413) → every 10 g oil ≈ 88 kcal. Chinese Dietary Guidelines 2022: adults ≤ 25–30 g cooking oil and < 5 g salt per day.
  - http://dg.cnsoc.org/article/04/ApX3_ozGTmSoqQaFFh5z_Q.html
- Example (arithmetic): 300 g broccoli + 200 g carrot raw ≈ 184 kcal; adding 15 g oil adds ≈133 kcal — the oil is ~42% of the tray's energy.
- **Implication:** roast-veg recipes must state oil grams per tray and per portion; offer "喷油壶/拌匀后称重" tip; default 5–10 g oil per 500 g veg (practical default — mark as a design choice, not a sourced number).

### R3.5 Sleep-friendly evening foods & caffeine
- Kiwifruit: 2 kiwis 1 h before bed for 4 weeks improved sleep onset (−35%) and total sleep (+13%) in 24 adults with sleep problems — uncontrolled, small. https://apjcn.qdu.edu.cn/20_2_22.pdf
- Caffeine: 400 mg taken even 6 h before bed reduced total sleep by >1 h (Drake 2013, n=12, placebo-controlled). https://europepmc.org/article/med/24235903
- **Implication:** optional "助眠小加餐" suggestion (kiwi, ≈ low-kcal) with "证据有限" label; caffeine cut-off nudge (bedtime − 6 h) for coffee/tea/pre-workout logged in food log.

### R3.6 Plateaus and diet breaks
- MATADOR (Byrne 2018, 51 men with obesity): 2 weeks deficit / 2 weeks maintenance (30 weeks total) gave more fat loss (12.3 vs 8.0 kg) than 16 weeks continuous, similar lean loss, and better 6-month retention. Population was obese and fed; generalisation to him is uncertain. https://pmc.ncbi.nlm.nih.gov/articles/PMC5803575/
- His timeline (~41 weeks to goal) has room for planned maintenance blocks.
- Water retention can mask fat loss for weeks; use weekly averages, not daily weights (PROMPT §6 already asks for 7-day moving average).
- **Implication:** plateau logic = 7-day avg flat ≥ 2–3 weeks AND log adherence OK → suggest (a) −100–150 kcal or more steps, or (b) a 1–2 week maintenance "饮食休息". Diet-break weeks shift the goal-date projection.

### R3.7 Real user pain points (Chinese sources, public)
- DT财经 youth-cooking survey (via 投资界): only 12.7% cook daily; top reasons not to cook = 工作忙没时间, 前期食材准备太复杂, 不想洗碗. Light-meal takeaway ≈ ¥30+/meal and repetitive; DIY "人粮" batch prep < ¥10/meal reported. https://news.pedaily.cn/202607/565754.shtml
- 知乎 user (lost 52.6 斤): early crash methods → binge after "reward" meal; what worked = fewer takeaways/snacks/奶茶, normal home food, watch girth at plateaus. https://www.zhihu.com/pin/special/1490786628621201408
- Common pattern in Chinese blog posts: batch-prepped identical boxes get boring by mid-week; all-or-nothing reaction after one slip; night eating after 21:00 is a common failure window (anecdotal). https://nutrola.app/zh/blog/why-meal-plans-dont-work-for-most-people , https://yunshangyoupin.com/719713
- **Implications:** (1) minimise dishes → one-tray/one-pot recipes, show "锅具数"; (2) variety via sauce rotation on the same base protein; (3) "没关系，继续" recovery flow after an over-target day (no shaming, weekly view); (4) takeaway quick-log with 少油少酱 tips.
