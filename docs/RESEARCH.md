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

### R1.6 Verified data for his staples (USDA FoodData Central, per 100 g)
| Food | kcal | protein | fat | FDC |
|---|---|---|---|---|
| Chicken thigh, meat only, roasted | 179 | 24.76 | 8.15 | 172388 https://fdc.nal.usda.gov/fdc-app.html#/food-details/172388/nutrients |
| Tuna, light, canned in water, drained | 86 | 19.44 | 0.96 | 173709 https://fdc.nal.usda.gov/fdc-app.html#/food-details/173709/nutrients |
| Tuna, white, canned in water, drained | — | 23.60 | — | 175158 https://fdc.nal.usda.gov/fdc-app.html#/food-details/175158/nutrients |
(Values read via FDC-mirroring pages; mark verified after the engineer re-checks on fdc.nal.usda.gov.)
