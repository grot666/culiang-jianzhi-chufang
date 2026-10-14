# RESEARCH round 5 — 2026-10-15 (SGT)

## R5.1 Shanghai everyday takeaway / breakfast — ESTIMATED energy table
**All rows are estimates (`verified:false`, show "≈").** Source: fatsecret.cn Chinese food database search pages (generic entries; aggregates 中国食物成分表/USDA/user data), queried 2026-10-15, URL pattern `https://www.fatsecret.cn/热量营养/search?q=<菜名>`. Restaurant dishes vary widely by oil and portion; per 百度健康 on 薄荷食物库, values can deviate ~10–20% between same-name dishes (https://health.baidu.com/m/detail/ar_6375304350607972256), and oil-heavy dishes likely more.

"Source portion" = portion stated by the source. "Default portion" = **design assumption** for quick-log (not sourced; user must be able to edit; recommend weighing once).

| Dish | kcal/100 g | P/F/C per 100 g | Source portion | Default portion (assumption) | ≈kcal at default |
|---|---|---|---|---|---|
| 生煎包 | 282 | 10.0/12.8/34.3 | 1个 = 70 kcal | 4个 | 280 |
| 小笼包 | 238 | 12.3/11.5/22.6 | 1个 = 83 kcal; 105 g = 250 | 1笼 8个 | 664 |
| 鲜肉小馄飨 | 259 (generic 馄飨 230) | 10.4/6.9/37.6 | 馄飨 1个 = 44 kcal | 1碗 15个, 汤不计 | 660 |
| 葱油拌面 | 144 | 4.3/4.8/20.7 | — | 350 g | 504 |
| 兰州拉面 | 117 | 4.9/4.0/15.2 | 300 g = 350 kcal | 500 g (含汤) | 585 |
| 大排 (炸, 浇头) | 250 | 17.1/17.9/4.5 | — | 120 g + 面 | 300 + 面 |
| 黄焖鸡米饭 | 167 | 14.1/7.8/9.5 | — | 500 g | 835 |
| 卤肉饭 | 187 | 5.9/9.6/18.9 | 120 g = 224 kcal | 350 g | 655 |
| 蛋炒饭 | 164 | 5.1/7.9/17.8 | — | 350 g | 574 |
| 煲仔饭 | — | — | 300 g = 455 kcal | 300 g | 455 |
| 麻辣烫 (不含汤) | 70 | 4.0/3.6/6.4 | — | 500 g | 350 (麻酱另计) |
| 麻辣香锅 | 99 | 4.6/5.2/9.7 | — | 500 g | 495 (+米饭) |
| 酸菜鱼 | 95 | 13.4/2.8/3.2 | — | 400 g (鱼+菜) | 380 (+米饭; 汤油未计) |
| 煎饼果子 | 161 | 6.3/2.6/27.1 | — | 250 g | 403 |
| 鸡蛋灌饼 | 253 | 12.3/7.5/34.7 | 1个 200 g = 506 kcal | 1个 | 506 |
| 肉夹馍 | 238 | 13.7/6.4/34.1 | 1个 200 g = 476 kcal | 1个 | 476 |
| 饭团 / 粢饭团 | 163 (便利店粢饭团 174–220) | 4.3/3.4/28.2 | 1个 = 179; 220 g = 358 | 1个 | 179–358 |
| 茶叶蛋 | 147 | 12.5/10.1/1.1 | 1个 60 g = 88 kcal | 1个 | 88 |
| 羊肉泡馍 | 133 | 6.0/4.9/17.7 | 200 g = 265 kcal | 500 g | 665 |
| 米饭 (参考) | 116 | 2.6/0.3/25.9 | 1碗 150 g = 174 kcal | 1碗 | 174 |

Takeaway tips for UI (practical, sourced where possible): 中国居民膳食指南2022: oil ≤ 25–30 g/d, salt < 5 g/d (http://dg.cnsoc.org/article/04/ApX3_ozGTmSoqQaFFh5z_Q.html). Practical copy: 备注“少油少酱”, 汤和红油不喝, 麻酱/底油单独放, 选蒸/煮/白灼优于炸/红烧.

## R5.2 Fiber swap suggestions — UI-ready copy + rules
Data: FDC-verified values from docs/RESEARCH.md R3.1 and docs/RESEARCH-R4.md R4.1 (per 100 g). Kiwi value not yet verified — engineer should add FDC 168153 (Kiwifruit, green, raw) before showing a number.

Rules (`js/core/fiber.js` suggested):
1. Trigger when `fiberToday < target × 0.6` after 17:00, or when the day plan's projected fiber < target.
2. Candidate swaps = items in table below; compute `fiberGain` and `kcalDelta` for the stated amount; rank by `fiberGain / max(kcalDelta, 20)`; show top 3.
3. Never suggest something that pushes the day > kcal target + 5%; prefer zero-kcal-delta swaps (replacements) first.
4. If gut-comfort risk (PROMPT §2.5) is high, always include one water tip.

| id | Copy (zh) | Calculation basis | fiberGain | kcalDelta |
|---|---|---|---|---|
| oats40 | 早餐粥里加 40 g 燕麦片，纤维 +4.2 g | oats 10.6 g/100 g, 389 kcal | +4.2 | +156 |
| peas100 | 饭里拌 100 g 豌豆，纤维 +5.7 g | peas 5.7, 81 kcal | +5.7 | +81 |
| broc200 | 晚餐多一份 200 g 白灼西兰花，纤维 +6.6 g | boiled 3.3, 35 kcal | +6.6 | +70 |
| spinach200 | 加一盘 200 g 菠菜，纤维 +4.4 g | spinach 2.2, 23 kcal | +4.4 | +46 |
| sweetpot | 把 150 g 白米饭换成 150 g 烤红薯，纤维 +4.4 g，热量 −60 kcal | rice 0.4/130 vs sweet potato 3.3/90 | +4.4 | −60 |
| brownhalf | 白米饭一半换糙米（200 g 熟饭），纤维 +1.2 g — 帮助有限 | brown 1.6 vs white 0.4 | +1.2 | −14 |
| mushroom150 | 炒菜加 150 g 香菇/蘑菇，纤维 +1.5 g | white mushroom 1.0, 22 kcal | +1.5 | +33 |

Copy tone: neutral, one line + "为什么" tooltip ("纤维目标 25–30 g，今天还差 X g"). Footnote: 数据来自 USDA FDC.

## R5.3 Weight log + 7-day moving average chart — interaction spec
Rationale: daily weight fluctuates with water/sodium; weekly averages are the signal (PROMPT §6; plateau logic R3.6). Pace guardrail 0.5–1%/wk (ISSN, R1.1).
- **Input:** one-tap "记体重" on home; numeric keypad, 1 decimal, prefilled with last value; date defaults to today (editable for back-fill); one entry per date (re-entry overwrites with confirm).
- **Storage:** `culiang.v1.weights = [{date:'YYYY-MM-DD', kg}]`, sorted; included in export/import.
- **MA rule:** for each date with data, MA7 = mean of entries within [date−6, date]; show MA only when ≥ 3 entries in window (else gap).
- **Chart:** inline SVG, no library; x = dates (last 8 weeks default; toggle 4w/12w/全部), dots = raw (light), line = MA7 (bold), dashed horizontal = goal weight, dotted line = projected pace from goal date.
- **Tap/hover:** tooltip with date, raw kg, MA7 kg.
- **Summary chips:** "本周均值", "较上周 ±x kg (±y%)", status: 正常 (0.25–1%/wk) / 偏快 (>1%, amber) / 持平 (<0.1 kg over 14 d with ≥5 logs/wk → link to plateau helper R-10).
- **Empty state:** "每周称 2–3 次，早上空腹、如厕后" (his plan says weigh 1–2×/week fasted; MA needs ≥3/wk to be smooth — show hint when fewer).
- **Accessibility:** chart has text summary for screen readers; 360 px width; dark mode colours.

## R5.4 Weekly review checklist (every Sunday; 2-minute flow)
Auto-filled from logs; user only confirms/adds notes.
1. 体重: this week MA7 vs last week (kg, %), status chip from R5.3.
2. 热量依从: days logged /7; days within ±10% of kcal target.
3. 蛋白: average g vs target; days ≥ target.
4. 纤维: average g vs 25–30 g; top fiber swap used.
5. 脂肪钱包: average fat g; % from low-value sources (fried/skin/takeaway oil).
6. 饮水: average ml vs target.
7. 花费: estimated food cost (sum of priceCNYPer500g × grams), takeaway count.
8. 备餐: evenings prepped /7; rice-safety reminder adherence (optional tick).
9. 睡眠 (optional self-rating 1–5) + dinner-to-bed gap average (from R-04 if available).
10. One decision for next week (choose one): 保持 / −100–150 kcal / +步数 / 维持周 (diet break, R3.6) / 换一个调味轮换.
Tone: neutral, no shaming; missing data shown as "未记录" not as failure.

## R5.5 Saved meal templates + 3-tap logging
Rationale: logging friction is a top reason tracking fails (R3.7; PROMPT §6 target "≤ 3 taps").
- **Template model:** `{id, name, items:[{foodId, grams}], tags, lastUsed, useCount}` in `culiang.v1.templates`.
- **Create:** (a) "存为模板" button on plate builder result and on any logged meal group; (b) preset templates shipped: "我的计划日·早餐" (3 eggs + oat porridge), "烤鸡腿饭" (120 g thigh + 200 g rice + 250 g veg + 5 g oil), "金枪鱼加餐" (100 g light tuna + veg) — values from R4.2.
- **3-tap flow:** Tap 1 = "+" FAB on 今日饮食 → sheet opens with tabs 常用 (templates by useCount) / 最近 / 搜索. Tap 2 = template card. Tap 3 = "记录" (portion multiplier chips ×0.5 / ×1 / ×1.5 default ×1). Done; toast with "撤销".
- **复制昨天:** one button copies yesterday's entries (confirm sheet with checkboxes, all ticked).
- **Takeaway quick-add:** search hits R5.1 table entries; default portion editable; logged with ≈.
- **Acceptance metric:** from app open to logged template ≤ 3 taps (manual test script in tests/README).
