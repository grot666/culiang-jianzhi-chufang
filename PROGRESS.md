# PROGRESS.md

## Current: 2026-10-15 03:40 +08 (deadline 10:00, ~6.3h left)

### Shipped versions
- 0.1.0: Profile & targets (Mifflin-St Jeor, macros, localStorage)
- 0.2.0: Ingredient search
- 0.3.0: Coarse-grain mixer
- 0.4.0: Plate builder
- 0.5.0: Daily food log
- 0.6.0: Fat wallet skeleton
- 0.7.0: Protein/fiber/recipes/weekly stubs
- 0.8.0: 49 ingredients + weekly stub

### Live site
https://grot666.github.io/culiang-jianzhi-chufang/ (enable Pages in Settings if not live: source main / root)

### Known
- Pages enable via API 403 (token). Manual enable needed.
- Ingredients: 49 / 120 target. Many estimates (verified:false shown as ≈).
- Core logic solid; more polish, recipes data, full generators pending.
- Tests pass for nutrition.

### Next recommended
- Expand to 120+ verified ingredients.
- Full weekly planner with budget/reuse.
- 30+ lazy veg recipes with oil grams.
- Export/import JSON, better gut-risk, weight log.
- UI polish, more tests.
