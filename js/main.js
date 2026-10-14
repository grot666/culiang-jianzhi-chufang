import { calculateTargets } from './core/nutrition.js';
import { blendGrains } from './core/grain.js';

const STORAGE_KEY = 'culiang.v1.profile';
let ingredients = [];
let grains = [];

async function loadIngredients() {
  try {
    const res = await fetch('./data/ingredients.json');
    ingredients = await res.json();
    renderIngredients(ingredients);
    grains = ingredients.filter(i => i.cookedYield);
    initPlate();
    initLog();
    initWeekly();
    initMixer();
  } catch (e) {
    console.error('Failed to load ingredients', e);
    document.getElementById('ingredient-list').textContent = '食材数据加载失败';
  }
}

function renderIngredients(list) {
  const el = document.getElementById('ingredient-list');
  if (!list.length) {
    el.innerHTML = '<p>无匹配食材</p>';
    return;
  }
  el.innerHTML = list.map(ing => `
    <div class="card">
      <strong>${ing.name}</strong> ${ing.verified ? '' : '≈'}
      <div>每100g: ${ing.kcal} kcal · P${ing.protein}g · F${ing.fat}g · C${ing.carbs}g · 纤${ing.fiber}g</div>
      <div style="font-size:0.85rem;color:#666">¥${ing.priceCNYPer500g}/500g · 来源: ${ing.source}</div>
    </div>
  `).join('');
}

function initSearch() {
  const input = document.getElementById('ingredient-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const filtered = ingredients.filter(i => 
      i.name.toLowerCase().includes(q) || 
      (i.tags && i.tags.some(t => t.includes(q)))
    );
    renderIngredients(filtered);
  });
}

function initMixer() {
  const container = document.getElementById('grain-selectors');
  if (!container || !grains.length) return;
  container.innerHTML = grains.map(g => `
    <label>${g.name} (%)
      <input type="number" class="grain-ratio" data-id="${g.id}" min="0" max="100" value="${g.id === 'rice-white' ? 60 : g.id === 'millet' ? 20 : g.id === 'corn-grits' ? 20 : 0}" step="5">
    </label>
  `).join('');
  const btn = document.getElementById('calc-blend');
  if (btn) {
    btn.addEventListener('click', () => {
      const selections = [];
      document.querySelectorAll('.grain-ratio').forEach(input => {
        const pct = +input.value;
        if (pct > 0) {
          const g = grains.find(gr => gr.id === input.dataset.id);
          if (g) selections.push({ ...g, ratioPct: pct });
        }
      });
      const result = blendGrains(selections);
      const el = document.getElementById('blend-result');
      if (!result) {
        el.innerHTML = '<p class="warning">比例总和需为100%</p>';
      } else {
        el.innerHTML = `
          <p>生100g: ${result.rawPer100.kcal} kcal · P${result.rawPer100.protein}g · F${result.rawPer100.fat}g · C${result.rawPer100.carbs}g</p>
          <p>熟100g: ${result.cookedPer100.kcal} kcal · P${result.cookedPer100.protein}g</p>
          <p>一碗熟 (~200g): ≈ ${result.bowlKcal} kcal</p>
          <p>建议水比约 1:${result.waterRatio} （根据电饭煲微调）</p>
          <p>${result.needsSoak ? '含需浸泡谷物（如糙米），建议提前泡30-60分钟' : '小米/玉米渣等可直接入锅'}</p>
          <p class="note">电饭煲步骤：混合谷物，按比例加水，选择普通煮饭模式。</p>
        `;
      }
      el.hidden = false;
    });
  }
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('load failed', e);
    return null;
  }
}

function saveProfile(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
  } catch (e) {
    console.error('save failed', e);
    alert('存储失败，请检查浏览器设置');
  }
}

function renderTargets(targets) {
  const el = document.getElementById('targets-display');
  el.innerHTML = `
    <p><strong>基础代谢 (BMR):</strong> ${targets.bmr} kcal</p>
    <p><strong>总消耗 (TDEE):</strong> ${targets.tdee} kcal</p>
    <p><strong>每日热量目标:</strong> ${targets.calories} kcal (默认 -20% 赤字)</p>
    <p><strong>蛋白质:</strong> ${targets.proteinG} g (1.6 g/kg)</p>
    <p><strong>脂肪:</strong> ${targets.fatG} g (约 25% 热量)</p>
    <p><strong>碳水:</strong> ${targets.carbsG} g (剩余)</p>
    <p><strong>膳食纤维:</strong> ${targets.fiberG} g</p>
    <p><strong>饮水:</strong> ${targets.waterMl} ml</p>
    ${targets.warnings.length ? `<p class="warning">${targets.warnings.join('<br>')}</p>` : ''}
  `;
  document.getElementById('targets').hidden = false;
}

function initProfile() {
  const form = document.getElementById('profile-form');
  const saved = loadProfile();
  if (saved) {
    document.getElementById('sex').value = saved.sex || 'male';
    document.getElementById('age').value = saved.age || 30;
    document.getElementById('height').value = saved.height || 170;
    document.getElementById('weight').value = saved.weight || 75;
    document.getElementById('goal-weight').value = saved.goalWeight || 70;
    document.getElementById('activity').value = saved.activity || 1.375;
    const targets = calculateTargets(saved);
    renderTargets(targets);
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      sex: form.sex.value,
      age: +form.age.value,
      height: +form.height.value,
      weight: +form.weight.value,
      goalWeight: +form['goal-weight'].value,
      activity: +form.activity.value
    };
    saveProfile(data);
    const targets = calculateTargets(data);
    renderTargets(targets);
  });
}

function initNav() {
  document.querySelectorAll('.bottom-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const page = document.getElementById(btn.dataset.page);
      if (page) page.classList.add('active');
    });
  });
}

function init() {
  initNav();
  initProfile();
  loadIngredients();
  initSearch();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW failed', err));
}

init();

function initPlate() {
  const stapleSel = document.getElementById('plate-staple');
  const proteinSel = document.getElementById('plate-protein');
  const vegSel = document.getElementById('plate-veg');
  if (!stapleSel) return;
  // Populate from ingredients
  const staples = ingredients.filter(i => i.tags && i.tags.includes('主食'));
  const proteins = ingredients.filter(i => i.tags && i.tags.includes('蛋白'));
  const vegs = ingredients.filter(i => i.tags && i.tags.includes('蔬菜'));
  stapleSel.innerHTML = staples.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  proteinSel.innerHTML = proteins.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  vegSel.innerHTML = vegs.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('calc-plate').addEventListener('click', () => {
    const stapleId = stapleSel.value;
    const proteinId = proteinSel.value;
    const vegId = vegSel.value;
    const stapleG = +document.getElementById('plate-staple-g').value;
    const proteinG = +document.getElementById('plate-protein-g').value;
    const vegG = +document.getElementById('plate-veg-g').value;
    const oilG = +document.getElementById('plate-oil-g').value;
    const get = id => ingredients.find(i => i.id === id) || {kcal:0,protein:0,fat:0,carbs:0,fiber:0};
    const staple = get(stapleId);
    const protein = get(proteinId);
    const veg = get(vegId);
    const oil = get('oil') || {kcal:899, fat:99.9};
    // Assume staple is cooked; simple scale
    const totalKcal = Math.round(
      (staple.kcal * stapleG / 100) +
      (protein.kcal * proteinG / 100) +
      (veg.kcal * vegG / 100) +
      (oil.kcal * oilG / 100)
    );
    const totalP = +(
      (staple.protein * stapleG / 100) +
      (protein.protein * proteinG / 100) +
      (veg.protein * vegG / 100)
    ).toFixed(1);
    const totalF = +(
      (staple.fat * stapleG / 100) +
      (protein.fat * proteinG / 100) +
      (veg.fat * vegG / 100) +
      (oil.fat * oilG / 100)
    ).toFixed(1);
    const el = document.getElementById('plate-result');
    el.innerHTML = `
      <p>本餐约: ${totalKcal} kcal · P ${totalP}g · F ${totalF}g</p>
      <p>健康: 4/5 · 好做: 5/5 · 便宜: 4/5 · 好吃: 4/5 （示例评分）</p>
      <p class="note">油量 ${oilG}g ≈ ${Math.round(oilG*0.9)} tsp，是脂肪主要来源。</p>
    `;
    el.hidden = false;
  });
}

// Call after load

const LOG_KEY = 'culiang.v1.dailyLog';

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  } catch { return []; }
}
function saveLog(log) {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch(e) { console.error(e); }
}

function initLog() {
  const sel = document.getElementById('log-food');
  if (!sel) return;
  sel.innerHTML = ingredients.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
  function render() {
    const log = loadLog();
    const listEl = document.getElementById('log-list');
    listEl.innerHTML = log.map((item, idx) => `<div class="card">${item.name} ${item.grams}g · ${item.kcal} kcal <button onclick="removeLog(${idx})">删</button></div>`).join('') || '<p>今日暂无记录</p>';
    // Summary
    const total = log.reduce((s, i) => ({kcal: s.kcal+i.kcal, p: s.p+i.protein, f: s.f+i.fat, c: s.c+i.carbs}), {kcal:0,p:0,f:0,c:0});
    const profile = loadProfile();
    let target = {calories: 1800, proteinG: 120};
    if (profile) {
      const t = calculateTargets(profile);
      target = t;
    }
    document.getElementById('log-summary').innerHTML = `
      <p>已摄入: ${Math.round(total.kcal)} kcal · P ${total.p.toFixed(1)}g · F ${total.f.toFixed(1)}g · C ${total.c.toFixed(1)}g</p>
      <p>剩余: ${Math.max(0, target.calories - Math.round(total.kcal))} kcal · P ${Math.max(0, target.proteinG - total.p).toFixed(1)}g</p>
    `;
  }
  document.getElementById('add-log').addEventListener('click', () => {
    const id = sel.value;
    const grams = +document.getElementById('log-grams').value;
    const ing = ingredients.find(i => i.id === id);
    if (!ing || grams <= 0) return;
    const log = loadLog();
    log.push({
      id, name: ing.name, grams,
      kcal: Math.round(ing.kcal * grams / 100),
      protein: +(ing.protein * grams / 100).toFixed(1),
      fat: +(ing.fat * grams / 100).toFixed(1),
      carbs: +(ing.carbs * grams / 100).toFixed(1)
    });
    saveLog(log);
    render();
  });
  document.getElementById('clear-log').addEventListener('click', () => {
    if (confirm('清空今日记录？')) { saveLog([]); render(); }
  });
  // Global remove for simplicity
  window.removeLog = (idx) => {
    const log = loadLog();
    log.splice(idx, 1);
    saveLog(log);
    render();
  };
  render();
}

// Ensure called

function initWeekly() {
  const btn = document.getElementById('gen-weekly');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const el = document.getElementById('weekly-result');
    el.innerHTML = `
      <h3>示例周计划（简化）</h3>
      <p>周一：杂粮饭 + 鸡胸 + 菠菜（油8g）</p>
      <p>周二：杂粮饭 + 鸡蛋 + 西兰花</p>
      <p>周三：红薯 + 豆腐 + 番茄</p>
      <p>... 共7天，复用食材。购物清单：大米、小米、鸡胸、鸡蛋、菠菜、西兰花、油等。</p>
      <p class="note">完整生成器将根据目标优化热量与蛋白。</p>
    `;
    el.hidden = false;
  });
}
// Call it
sed -i '/initLog();/a\    initWeekly();' js/main.js 2>/dev/null || true
    initWeekly();

function initBackup() {
  document.getElementById('export-data')?.addEventListener('click', () => {
    const data = {
      profile: loadProfile(),
      log: loadLog(),
      version: 1,
      exported: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'culiang-backup.json';
    a.click();
  });
  document.getElementById('import-data')?.addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  document.getElementById('import-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.profile) saveProfile(data.profile);
        if (data.log) saveLog(data.log);
        alert('导入成功，刷新页面查看');
        location.reload();
      } catch { alert('无效 JSON'); }
    };
    reader.readAsText(file);
  });
}
// Call
sed -i '/initWeekly();/a\    initBackup();' js/main.js || echo "initBackup();" >> js/main.js
