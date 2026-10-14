# 粗粮减脂厨房

Fat-loss meal planning web app focused on coarse grains, practical Shanghai nutrition, mobile-first.

**Live (after enabling Pages):** https://grot666.github.io/culiang-jianzhi-chufang/

## Enable GitHub Pages
1. Go to repo Settings > Pages
2. Source: Deploy from a branch
3. Branch: main / /(root)
4. Save. Site will be live in 1-2 minutes.

## Features (v0.9.0)
- 我的目标：BMR/TDEE/macros calculation
- 食材库：49+ items, search
- 杂粮饭配比器
- 一餐搭配
- 今日饮食 log
- 脂肪预算 / 蛋白 / 纤维 / 蔬菜菜谱 / 一周菜单 (skeletons + some logic)
- JSON export/import
- PWA, offline-capable, dark mode
- Unit tests: `node --test`

UI: Simplified Chinese. Data: localStorage only. No external APIs.

See PROGRESS.md, CHANGELOG.md, PROMPT.md for details.

## Development
Plain HTML/CSS/vanilla JS. Push to main for deploy.
