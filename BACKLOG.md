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

## Research-driven items (from needs-research worker; sources in docs/RESEARCH.md)
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
- **P1 · R-04 Bedtime-aware dinner nudge (into #1 profile + #5 log)** — RESEARCH R1.4
  - Profile has bedtime (default 23:30). Daily view shows "晚餐建议在 HH:MM 前吃完" (bedtime − 3 h).
  - Evening prep plan separates 备餐 (for tomorrow) from 今晚吃; no big meal suggested within 2 h of bedtime.
- **P1 · R-05 护腕 (wrist-friendly) recipe tag & filter (into #9 懒人蔬菜 and plate builder)** — RESEARCH R1.5
  - Recipe field `wristFriendly` (bool) + `wristNotes`; filter chip "护腕".
  - Rule: no wok tossing, no one-hand heavy pan lift, no hard-squash/tough-root chopping unless pre-cut option listed. ≥ 10 recipes tagged at launch (sheet-pan/air-fryer roast veg, rice-cooker one-pot, microwave steam).
- **P1 · R-06 Owner's staples verified first (into #2 食材库)** — RESEARCH R1.6
  - Seed: 鸡腿肉去皮(熟,烤) 179 kcal/24.76 P/8.15 F; 水浸金枪鱼(淡,沥干) 86/19.44/0.96, with USDA FDC IDs as `source`.
  - These show without "≈" only after verification on fdc.nal.usda.gov.
