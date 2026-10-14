# BACKLOG.md

## Status audit — 2026-10-15 04:30 SGT (needs-research worker, from code on main @5f6995e)
Legend: ✅ done · 🟡 partial (basic version works) · ⬜ stub/not started.

> **⚠️ BLOCKER (P0, fix first): `js/main.js` on main contains two literal shell lines** (`sed -i '/initLog();/a\    initWeekly();' js/main.js ...` and `sed -i '/initWeekly();/a\    initBackup();' ...`). These are JavaScript syntax errors, so the whole ES module fails to parse and **no feature runs on the live site**. Also `initBackup()` is never actually called (export/import buttons dead) and a stray top-level `initWeekly();` exists.
> Acceptance: remove the shell lines; call `initWeekly()`/`initBackup()` once inside `loadIngredients()`/`init()`; `node --check js/main.js` passes; add a test or CI step that runs `node --check` on all JS.

> Note: PM summary mentions "v0.2 lazy-veg 32 recipes + ~100 USDA-verified foods, v0.3 weekly menu/shopping list/Sunday prep". **Not present on main as of @5f6995e** (CHANGELOG goes 0.1→0.9 with 49 ingredients, no recipe data file, weekly = hard-coded text). If that work exists locally, it hasn't been pushed.

## Mission features
1. 🟡 **我的目标** — form, Mifflin-St Jeor, TDEE, macros, BMR floor, localStorage done (v0.1). Missing: R-01 pace check, R-02 protein modes (code hard-codes 1.6 g/kg; BMI≥30 TODO), fat-floor 20% check, fast-loss warning.
2. 🟡 **食材库** — search by name/tag, ≈ for unverified (v0.2/v0.8, 49 items). Missing: pinyin search, per-portion view, custom foods, ≥120 items, R-06/R-16 verified seeds.
3. 🟡 **杂粮饭配比器** — ratios, raw/cooked macros, bowl kcal, water ratio, soak hint (v0.3). Missing: save favourite blends, R-03 rice-safety copy, R-07 white-rice comparison/fiber.
4. 🟡 **一餐搭配** — staple/protein/veg/oil → kcal/P/F (v0.4). Missing: live bars vs per-meal targets; scores are hard-coded "示例评分"; oil uses fallback 899 kcal if no `oil` item.
5. 🟡 **今日饮食** — add by grams, remaining kcal/P, persistence (v0.5). Missing: favourites/recents, 碗/个/勺 presets, end-of-day summary, per-date logs (single list, never rolls over).
6. ⬜ **脂肪预算** — explanatory skeleton only.
7. ⬜ **蛋白补充** — stub.
8. ⬜ **纤维与饮水** — stub.
9. ⬜ **懒人蔬菜** — stub (0 recipes on main).
10. ⬜ **一周菜单与购物清单** — hard-coded example text.

## Foundation
- 🟡 JSON export/import written but not wired (see blocker). Exports profile+log only.
- ✅ PWA manifest + network-first SW; ✅ nutrition unit tests. ⬜ grain/plate tests, schema version migrations.
- ⬜ GitHub Pages not enabled (API 403) — owner must enable in Settings.

## Research items status
None of R-01…R-16 is implemented on main yet. Keep priorities below.

---

## Next batch (N-xx, from docs/RESEARCH-R5.md) — do after the blocker

- **P0 · N-01 Per-date food log** (prereq for N-03/N-04/N-06)
  - Log stored as `culiang.v1.log.YYYY-MM-DD`; today's view starts empty each day; history readable for 30 days.
  - Migration: existing `culiang.v1.dailyLog` moves to today's date once; unit test for migration.
- **P0 · N-02 Weight log + 7-day MA chart** — R5.3
  - One-tap entry (1 decimal, prefilled, back-fill date); one entry/date; stored in `culiang.v1.weights`; included in export.
  - MA7 shown only with ≥3 points in window; inline SVG with raw dots, MA line, goal line; 4w/8w/12w/全部 toggle; tooltip.
  - Status chip: 正常 0.25–1%/wk, 偏快 >1%/wk, 持平 per R-10 rule. Unit tests: MA7 math, gap rule, %/wk.
- **P0 · N-03 Saved meal templates + 3-tap log** — R5.5
  - "+" → 常用/最近/搜索 sheet → template → 记录 (×0.5/×1/×1.5) = 3 taps; undo toast.
  - "存为模板" from plate builder; 3 shipped presets from R4.2/R5.5; "复制昨天" with checkbox confirm.
  - Unit tests: template expand × multiplier; copy-yesterday.
- **P1 · N-04 Fiber swap suggestions** — R5.2 (implements R-15)
  - `js/core/fiber.js` ranks the 7 swaps by fiberGain/max(kcalDelta,20); shows top 3 when fiber < 60% target after 17:00 or projected day < target.
  - Never exceeds kcal target +5%; water tip added when gut risk high. Copy exactly as R5.2 table.
  - Correction: row `brownhalf` in R5.2 is wrong — use "把 200 g 白米饭换成糙米，纤维 +2.4 g，热量 −14 kcal" (1.6 vs 0.4 g/100 g; 123 vs 130 kcal).
  - Unit test: owner template day returns oats40/peas100/broc200 among top 3.
- **P1 · N-05 Shanghai takeaway quick-add** — R5.1 (implements R-13 part)
  - Add the 20 R5.1 rows as `type:"dish"`, `verified:false`, `source:"fatsecret.cn 估算"`, with `defaultPortionG` and `portionNote:"默认份量为假设，建议称重"`.
  - Always shown with ≈ and a tip line (少油少酱/汤不喝/酱单放).
  - Unit test: 黄焖鸡米饭 default 500 g → 835 kcal.
- **P1 · N-06 Weekly review (Sunday)** — R5.4
  - 10-item checklist auto-filled from N-01/N-02 data; missing data = "未记录"; one decision choice saved to `culiang.v1.reviews`.
  - Decision "−100–150 kcal" updates profile target with confirm; "维持周" sets target = TDEE for 7 days.
  - Unit test: adherence and averages from fixture week.
- **P2 · N-07 Verify kiwi before showing** — add FDC 168153 (Kiwifruit, green, raw) via FDC API, then enable R-12 card with a number.
- **P2 · N-08 JS syntax guard** — `npm test` (or `node --test`) also runs `node --check` on every file in `js/`; fails CI on parse errors.

---

## Research-driven items (from needs-research worker; sources in docs/RESEARCH.md, RESEARCH-R4.md, RESEARCH-R5.md)
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
- **P0 · R-15 Fiber gap fix in owner's default day (into #8 纤维与饮水 and #10)** — RESEARCH-R4 R4.2 (implemented via N-04)
  - His template day computes to ≈15 g fiber vs 25–30 g target; fiber tracker must flag this on day 1.
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
  - Rule: no wok tossing, no one-hand heavy pan lift, no hard-squash/tough-root chopping unless pre-cut option listed. ≥ 10 recipes tagged at launch.
- **P1 · R-07 Grain mixer honesty: kcal vs fiber/GI (into #3 杂粮饭配比器)** — RESEARCH R2.1
  - Mixer output shows kcal/100 g cooked side-by-side with plain white rice, plus fiber delta and an approximate GI band (低/中/高, "≈, 仅供参考").
  - Unit test: 100% white rice blend = 130 kcal/100 g cooked (FDC 168878) ± rounding.
- **P1 · R-08 Oil grams on every roast/stir-fry recipe (into #9 and #6 fat wallet)** — RESEARCH R3.4
  - Each recipe has `oilG` per tray and per portion; kcal from oil shown separately (10 g ≈ 88 kcal).
  - Daily oil total compared to 中国居民膳食指南 25–30 g. Unit test: 15 g olive oil adds 132.6 kcal / 15 g fat.
- **P1 · R-09 Fish/tuna weekly counter (into #5 log / #10 plan)** — RESEARCH R3.3
  - Food items carry `mercuryClass` (best/good/avoid per FDA list); tuna split into 淡(鰣鱼/skipjack) and 白(长鳍/albacore).
  - Weekly soft note when light tuna > 3×113 g or albacore > 1×113 g; rotate shrimp/salmon/鲳鱼.
- **P1 · R-10 Plateau & diet-break assistant (Insight pass)** — RESEARCH R3.6
  - Trigger only when 7-day avg change < 0.1 kg over ≥ 14 days AND ≥ 5 days/week logged; offer −100–150 kcal / +steps / 1–2 wk maintenance. Unit tests for trigger.
- **P1 · R-11 Low-friction batch prep (into #10)** — RESEARCH R3.7, R1.5, RESEARCH-R4 R4.3
  - 30-min evening template (rice cooker + one tray/air fryer + microwave eggs) with active minutes, 锅具数, 护腕 flag; ≥ 5 low-oil sauces rotated.
- **P2 · R-12 Sleep helpers (into #5 log)** — RESEARCH R3.5
  - Caffeine nudge after bedtime − 6 h; optional kiwi card "证据有限" (after N-07).
- **P2 · R-13 Slip recovery (Friction pass)** — RESEARCH R3.7
  - After an over-target day, show weekly average and "继续就好" (neutral tone). Takeaway part moved to N-05.
