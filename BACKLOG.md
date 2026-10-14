# BACKLOG.md

## Priority order (from mission)

1. **我的目标 (Profile & targets)** — onboarding form (sex, age, height, weight, goal weight, activity); computes kcal / protein / fat / carbs / fiber / water; stores in localStorage.
   - Acceptance: form validates, computes Mifflin-St Jeor BMR, TDEE, macros correctly; persists; shows explanations.
2. **食材库 (Ingredient database & search)** — search by Chinese name, pinyin or tag; per-100 g and per-portion views; user-added custom foods.
3. **杂粮饭配比器 (Coarse-grain rice mixer)**
4. **一餐搭配 (Plate builder)**
5. **今日饮食 (Daily food log)**
6. **脂肪预算 (Fat wallet)**
7. **蛋白补充 (Protein gap & powder advisor)**
8. **纤维与饮水 (Fiber & water tracker)**
9. **懒人蔬菜 (Lazy vegetable recipes)** — ≥ 30 recipes
10. **一周菜单与购物清单 (Weekly plan + shopping list)**

## Foundation
- Data layer, JSON export/import, PWA shell.
- Unit tests for core calculations.

## After 10 features
Rotate through friction, nutrition quality, insight, polish, reliability.

## Research-driven items (from needs-research worker; sources in docs/RESEARCH.md and docs/RESEARCH-R4.md)
Fold these into the features above; P0 = do while building that feature.

- **P0 · R-01 Goal pace & end-point check (into #1 我的目标)** — RESEARCH R1.1
  - Given start weight, goal weight, goal date: show kg/week and %BW/week; flag if >1%/wk (red) or <0.25%/wk (info).
  - Optional body-fat % input: show estimated BF% at goal weight assuming lean mass kept; if <10% show a neutral note ("目标体重可能低于保肌可达范围，建议以腰围/体脂复核").
  - Unit test: 74→58 kg over 2026-10-15..2027-07-31 gives ≈0.39 kg/wk, ≈0.53%/wk.
- **P0 · R-02 Protein target modes (into #1 and #7)** — RESEARCH R1.2
  - Modes: g/kg body weight (default 1.6, 1.2–2.4) and g/kg FFM (default 2.3, 2.3–3.1; needs BF%). Plus manual override (e.g. his plan 130–160 g).
  - UI one-liner cites the range source. Unit tests for both modes.
- **P0 · R-03 Rice batch-prep safety (into #3 杂粮饭配比器 and #10 周日备餐)** — RESEARCH R1.3
  - Every cook-ahead rice/grain plan shows: 1小时内摊开冷却→冷藏→24小时内吃完→只复热一次且热透.
  - Batch plans never schedule cooked rice for >24 h later (unit test in plan generator); multi-day rice must be frozen.
- **P0 · R-06 Seed verified FDC staples (into #2 食材库)** — RESEARCH R3.1 (verified via official FDC API)
  - Add the 10 rows of R3.1 (thigh, breast, light/white tuna, white/brown rice, millet, broccoli, carrot, olive oil) with `source: "USDA FDC <id>"`, `verified: true`.
  - Unit test: data file values equal R3.1 table; UI shows no "≈" for these.
- **P0 · R-15 Fiber gap fix in owner's default day (into #8 纤维与饮水 and #10)** — RESEARCH-R4 R4.2
  - His template day computes to ≈15 g fiber vs 25–30 g target; fiber tracker must flag this on day 1.
  - Swap suggestions ranked by fiber gained per kcal, using verified values: 燕麦 40 g (+4.2 g), 豌豆 100 g (+5.7 g), extra leafy veg, 2 kiwis; note that half brown rice only adds ≈2.4 g.
  - Unit test: template day fiber = 15 ± 1 g; after adding 40 g oats + 100 g peas ≥ 24 g.
- **P1 · R-14 Owner's plan as default template (into #4 / #10)** — RESEARCH-R4 R4.2
  - Preset "我的计划日" = 3 eggs, 400 g rice, 360 g skinless thigh, 100 g light tuna, 500 g broccoli+carrot, 15 g oil.
  - Unit test: totals ≈ 1782 kcal / 149 g P / 62 g F / 153 g C (±2%).
- **P1 · R-16 Seed 12 more verified foods (into #2)** — RESEARCH-R4 R4.1
  - Eggs (raw, boiled), shrimp, firm tofu, salmon, oats, sweet potato, boiled broccoli, spinach, white mushroom, peas, avocado with FDC ids; 南豆腐 stays `verified:false` until a Chinese table value is added.
- **P1 · R-04 Bedtime-aware dinner nudge (into #1 profile + #5 log)** — RESEARCH R1.4
  - Profile has bedtime (default 23:30). Daily view shows "晚餐建议在 HH:MM 前吃完" (bedtime − 3 h).
  - Evening prep plan separates 备餐 (for tomorrow) from 今晚吃; no big meal suggested within 2 h of bedtime.
- **P1 · R-05 护腕 (wrist-friendly) recipe tag & filter (into #9 懒人蔬菜 and plate builder)** — RESEARCH R1.5
  - Recipe field `wristFriendly` (bool) + `wristNotes`; filter chip "护腕".
  - Rule: no wok tossing, no one-hand heavy pan lift, no hard-squash/tough-root chopping unless pre-cut option listed. ≥ 10 recipes tagged at launch (sheet-pan/air-fryer roast veg, rice-cooker one-pot, microwave steam).
- **P1 · R-07 Grain mixer honesty: kcal vs fiber/GI (into #3 杂粮饭配比器)** — RESEARCH R2.1
  - Mixer output shows kcal/100 g cooked side-by-side with plain white rice, plus fiber delta and an approximate GI band (低/中/高, labelled "≈, 仅供参考").
  - No copy claims coarse grains are lower-calorie; portion (碗/克) is presented as the main kcal lever.
  - Unit test: 100% white rice blend = 130 kcal/100 g cooked (FDC 168878) ± rounding.
- **P1 · R-08 Oil grams on every roast/stir-fry recipe (into #9 and #6 fat wallet)** — RESEARCH R3.4
  - Each recipe has `oilG` per tray and per portion; kcal from oil shown separately (10 g ≈ 88 kcal).
  - Daily oil total compared to 中国居民膳食指南 25–30 g; fat wallet categorises skin-on/fried as low-value.
  - Unit test: recipe with 15 g olive oil adds 132.6 kcal / 15 g fat.
- **P1 · R-09 Fish/tuna weekly counter (into #5 log / #10 plan)** — RESEARCH R3.3
  - Food items carry `mercuryClass` (best/good/avoid per FDA list); tuna split into 淡(鰣鱼/skipjack) and 白(长鳍/albacore).
  - Weekly soft note when light tuna > 3×113 g or albacore > 1×113 g; plan generator rotates in shrimp/salmon/鲳鱼. Copy says it's a conservative reference.
- **P1 · R-10 Plateau & diet-break assistant (Insight pass)** — RESEARCH R3.6
  - Trigger only when 7-day avg weight change < 0.1 kg over ≥ 14 days AND ≥ 5 days/week logged.
  - Offer: −100–150 kcal, or +steps, or 1–2 week maintenance block; maintenance block updates goal-date projection.
  - Unit tests for trigger logic (no trigger with sparse logging).
- **P1 · R-11 Low-friction batch prep: one tray, few dishes (into #10 周日备餐/晚间备餐)** — RESEARCH R3.7, R1.5, RESEARCH-R4 R4.3
  - A 30-min evening template: rice cooker (杂粮饭) + one sheet pan/air fryer (thigh + veg) + microwave eggs; shows total active minutes, 锅具数, and 护腕 flag.
  - Sauce rotation (≥ 5 low-oil sauces) so the same base doesn't repeat flavour 2 days running.
- **P2 · R-12 Sleep helpers (into #5 log)** — RESEARCH R3.5
  - Caffeine items flagged; nudge if logged after bedtime − 6 h.
  - Optional "助眠小加餐" card (2 个猕猴桃) labelled "证据有限".
- **P2 · R-13 Slip recovery & takeaway quick-log (Friction pass)** — RESEARCH R3.7
  - After an over-target day, show weekly average and "继续就好" (neutral tone, no red shaming).
  - Takeaway quick-add with 少油少酱 tips; marked ≈.
